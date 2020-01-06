import { createAppServer } from './server'
import { logger } from './logger'
import { Server, IncomingMessage, ServerResponse } from 'http'

let server: Server

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const responseBody = {
        message: 'Hello World',
        method: req.method,
        url: req.url
    }

    const buffer = Buffer.from(JSON.stringify(responseBody))

    res.setHeader('Content-Length', buffer.length)
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(buffer)
}

export function start(): Server {
    server = createAppServer(handleRequest)
    server.listen(process.env.PORT)
    return server
}

export async function shutdown(): Promise<void> {
    logger.debug({ msg: 'closing server' })
    await new Promise(resolve => server.close(resolve))

    // Shutdown any other dependencies here
    // i.e. database connections, loggers, etc...
}
