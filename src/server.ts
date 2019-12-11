import { readFile } from 'fs'
import { createSecureServer, Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { AddressInfo } from 'net'
import { join } from 'path'
import { promisify } from 'util'
import { generate } from 'selfsigned'
import { logger } from './logger'

const readFileAsync = promisify(readFile)
if (process.env.CERTS_PATH == undefined) {
    process.env.CERTS_PATH = 'certs'
}

export async function createAppServer(
    requestHandler: (req: Http2ServerRequest, res: Http2ServerResponse) => void
): Promise<Http2Server> {
    let cert = await getCert('fullchain.pem')
    let key = await getCert('privkey.pem')

    if (cert == undefined || key == undefined) {
        logger.info({ msg: 'generating self signed certs' })
        const pems = generate()
        cert = pems.cert
        key = pems.private
    }

    const server: Http2Server = createSecureServer({ cert, key, allowHTTP1: true }, requestHandler)

    server
        .on('listening', () => {
            logger.info({ msg: `server listening`, port: (server.address() as AddressInfo).port.toString() })
        })
        .on('error', function serverError(err: Error) {
            logger.error({ msg: `server error`, error: err.message })
        })
        .on('close', () => {
            logger.info({ msg: 'server closed' })
        })

    return server
}

async function getCert(filename: string): Promise<Buffer> {
    try {
        return await readFileAsync(join(process.env.CERTS_PATH, filename))
    } catch {
        return undefined
    }
}
