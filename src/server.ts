import { AddressInfo } from 'net'
import { logger } from './logger'
import { Server, IncomingMessage, ServerResponse } from 'http'

export function createAppServer(requestHandler: (req: IncomingMessage, res: ServerResponse) => void): Server {
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
