/* istanbul ignore file */
import * as Router from 'find-my-way'
import { Server } from 'http'
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { handleCors } from './lib/cors'
import { stopLogger } from './lib/logger'
import { startServer, stopServer } from './lib/server'
import { pingRoute } from './routes/ping'

export function start(): Promise<Server | Http2Server | undefined> {
    return startServer({ requestHandler })
}

export async function stop(): Promise<void> {
    await stopServer()
    stopLogger()
}

export async function requestHandler(req: Http2ServerRequest, res: Http2ServerResponse): Promise<void> {
    handleCors(req, res)

    const route = router.find(req.method as Router.HTTPMethod, req.url)
    if (route === null) return res.writeHead(404).end()
    else {
        const result: unknown = route.handler(req, res, route.params, route.store)
        if (result instanceof Promise) await result
    }
}

export const router = Router<Router.HTTPVersion.V2>()
router.get('/ping', pingRoute as Router.Handler<Router.HTTPVersion.V2>)
