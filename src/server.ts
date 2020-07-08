import { Server, IncomingMessage, ServerResponse } from 'http'
import { Http2Server, Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { AddressInfo } from 'net'
import { logger, stopLogger } from './logger'
import { handleRequest } from './app'

let server: Server | Http2Server | Http2SecureServer

export function startServer(): Server | Http2Server | Http2SecureServer {
    server = new Server(handleRequest)
        .on('listening', () => {
            logger.info({ msg: `server listening`, port: (server.address() as AddressInfo).port })
        })
        .on(
            'error',
            /*istanbul ignore next */ function serverError(err: Error) {
                logger.error({ msg: `server error`, error: err.message, errorName: err.name })
            }
        )
        .on('close', () => {
            logger.info({ msg: 'server closed' })
        })
        .listen(process.env.PORT)
    return server
}

export async function stopServer(): Promise<void> {
    /*istanbul ignore next */
    setTimeout(function () {
        logger.error('shutdown timeout')
        throw new Error('shutdown timeout')
    }, 30 * 1000).unref()

    logger.debug({ msg: 'closing server' })
    await new Promise((resolve) => server.close(resolve))

    // Shutdown any other dependencies here after the server has fully closed.
    // i.e. database connections, etc...

    stopLogger()
}
