// This example server uses HTTP 1.x but Node.js also supports HTTP2.
// This example server is not using HTTPS, but HTTPS can be configured for Node.js.

import { AddressInfo } from 'net'
import { logger } from './logger'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'

export function createAppServer(
    requestHandler: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void
): Server {
    const server: Server = new Server(requestHandler)
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

    return server
}
