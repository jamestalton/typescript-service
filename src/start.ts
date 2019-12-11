import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { createAppServer } from './server'
import { logger } from './logger'

let server: Http2Server

function handleRequest(req: Http2ServerRequest, res: Http2ServerResponse): void {
    const responseBody = {
        method: req.method,
        url: req.url
    }

    const buffer = Buffer.from(JSON.stringify(responseBody))

    res.setHeader('Content-Length', buffer.length)
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(buffer)
}

export async function start(): Promise<Http2Server> {
    const requestHandler: (req: Http2ServerRequest, res: Http2ServerResponse) => void = handleRequest
    server = await createAppServer(requestHandler)
    server.listen(process.env.PORT)
    return server
}

export async function shutdown(): Promise<void> {
    logger.debug({ msg: 'closing server' })
    await new Promise(resolve => server.close(resolve))

    // Shutdown any other dependencies here
    // i.e. database connections, loggers, etc...
}
