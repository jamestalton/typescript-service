/* istanbul ignore file */
import * as Router from 'find-my-way'
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { corsMiddleware } from './lib/cors-middleware'
import { EventStreams } from './lib/event-streams'
import { stopDatabase } from './lib/level'
import { logger, stopLogger } from './lib/logger'
import { respondInternalServerError, respondNotFound } from './lib/respond'
import { startServer, stopServer } from './lib/server'
import { deleteCollectionRoute } from './routes/delete-collection'
import { deleteItemRoute } from './routes/delete-item'
import { getItemRoute } from './routes/get-item'
import { getStreamRoute } from './routes/get-stream'
import { pingRoute } from './routes/ping'
import { proxyRoute } from './routes/proxy'
import { putItemRoute } from './routes/put-item'

export function start(): Promise<Http2Server | undefined> {
    return startServer({ requestHandler })
}

export async function stop(): Promise<void> {
    await stopServer()
    await EventStreams.dispose()
    await stopDatabase()
    stopLogger()
}

export let requestHandler: (req: Http2ServerRequest, res: Http2ServerResponse) => Promise<void>

if (process.env.NODE_ENV !== 'production') {
    requestHandler = corsMiddleware(routeHandler)
} else {
    requestHandler = routeHandler
}

async function routeHandler(req: Http2ServerRequest, res: Http2ServerResponse): Promise<void> {
    const route = router.find(req.method as Router.HTTPMethod, req.url)
    if (route === null) {
        return respondNotFound(res)
    } else {
        try {
            const result: unknown = route.handler(req, res, route.params, route.store)
            if (result instanceof Promise) await result
        } catch (err) {
            if (err instanceof Error && err.name == 'NotFoundError') {
                return respondNotFound(res)
            } else {
                respondInternalServerError(res)
                logger.error(err)
            }
        }
    }
}

export const router = Router<Router.HTTPVersion.V2>()
router.get('/ping', pingRoute as Router.Handler<Router.HTTPVersion.V2>)
router.get('/proxy/example.com', proxyRoute('https://example.com'))

router.delete('/data/:collection', deleteCollectionRoute as Router.Handler<Router.HTTPVersion.V2>)

router.get('/data/events', getStreamRoute as Router.Handler<Router.HTTPVersion.V2>)

router.get('/data/:collection/:id/:rev', getItemRoute as Router.Handler<Router.HTTPVersion.V2>)
router.get('/data/:collection/:id', getItemRoute as Router.Handler<Router.HTTPVersion.V2>)
router.put('/data/:collection/:id', putItemRoute as Router.Handler<Router.HTTPVersion.V2>)
router.delete('/data/:collection/:id', deleteItemRoute as Router.Handler<Router.HTTPVersion.V2>)
