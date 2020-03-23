import { createAppServer } from './server'
import { logger, loggerShutdown } from './logger'
import { Server, IncomingMessage, ServerResponse, STATUS_CODES } from 'http'
import { Http2ServerRequest, Http2ServerResponse, Http2Server, Http2SecureServer } from 'http2'

let server: Server | Http2Server | Http2SecureServer

export function start(): Server | Http2Server | Http2SecureServer {
    server = createAppServer(handleRequest)
    server.listen(process.env.PORT)
    return server
}

export async function shutdown(): Promise<void> {
    // Shutdown timeout
    // Sometimes during development or testing
    // we get into a case where the service wil not shutdown
    // because we have not closed all open handles or calls.
    // This timeout forces a shutdown after 30s
    /* istanbul ignore next */
    setTimeout(function () {
        logger.error('shutdown timeout')
        throw new Error('shutdown timeout')
    }, 30 * 1000).unref()

    // Server close
    // Stops the server from accepting new connections and keeps existing connections.
    // This function is asynchronous, the server is finally closed when
    // all connections are ended and the server emits a 'close' event.
    // The optional callback will be called once the 'close' event occurs.
    // This means requests may still be being handled until the close finishes,
    // so do not close any needed resources such as databases until after this.
    logger.debug({ msg: 'closing server' })
    await new Promise((resolve) => server.close(resolve))

    // Shutdown any other dependencies here after the server has fully closed.
    // i.e. database connections, etc...

    // Shutdown logger
    loggerShutdown()
}

// This example is using the built in functionality of Node.js to handle the request and response.
//
// Replace the handle request with the node.js web framework of your choice.
// - Fastify : https://www.fastify.io/
// - KOA : https://koajs.com/
// - Express : https://expressjs.com/
//
// All of these frameworks have middleware that can be added to handle compression, request decoding, response encoding, etc...
//
function handleRequest(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse): void {
    const buffer = Buffer.from(JSON.stringify({ message: 'Hello World' }))
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Length', buffer.length)
    res.writeHead(200)
    res.end(buffer)

    logger.info({
        msg: STATUS_CODES[res.statusCode],
        status: res.statusCode,
        method: req.method,
        url: req.url,
    })
}
