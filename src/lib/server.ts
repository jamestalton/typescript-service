/* istanbul ignore file */
import { readFileSync } from 'fs'
import { STATUS_CODES } from 'http'
import {
    constants,
    createSecureServer,
    createServer as createHttp2Server,
    Http2Server,
    Http2ServerRequest,
    Http2ServerResponse,
} from 'http2'
import { Socket } from 'net'
import { TLSSocket } from 'tls'
import { logger } from './logger'

let server: Http2Server | undefined

interface ISocketRequests {
    socketID: number
    activeRequests: number
}

let nextSocketID = 0
const sockets: { [id: string]: Socket | TLSSocket | undefined } = {}

export type ServerOptions = {
    requestHandler:
        | ((req: Http2ServerRequest, res: Http2ServerResponse) => void)
        | ((req: Http2ServerRequest, res: Http2ServerResponse) => Promise<unknown>)
    logRequest?: (req: Http2ServerRequest, res: Http2ServerResponse) => void
}

export function startServer(options: ServerOptions): Promise<Http2Server | undefined> {
    let cert: Buffer | string | undefined
    let key: Buffer | string | undefined
    try {
        cert = readFileSync('certs/tls.crt')
        key = readFileSync('certs/tls.key')
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const selfsigned = require('selfsigned') as {
            generate: (
                t: unknown,
                options: {
                    // keySize: 2048, // the size for the private key in bits (default: 1024)
                    // days: 30, // how long till expiry of the signed certificate (default: 365)
                    // algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
                    // extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
                    // pkcs7: true, // include PKCS#7 as part of the output (default: false)
                    // clientCertificate: true, // generate client cert signed by the original key (default: false)
                    // clientCertificateCN: 'jdoe', // client certificate's common name (default: 'John Doe jdoe123')
                }
            ) => {
                cert: string
                private: string
            }
        }
        const pems = selfsigned.generate(null, {})
        cert = pems.cert
        key = pems.private
        logger.warn({ msg: 'using self signed certs' })
    }

    try {
        if (cert && key) {
            logger.debug({ msg: `server start`, secure: true })
            server = createSecureServer(
                { cert, key, allowHTTP1: true },
                options.requestHandler as (req: Http2ServerRequest, res: Http2ServerResponse) => void
            )
        } else {
            logger.debug({ msg: `server start`, secure: false })
            server = createHttp2Server(
                options.requestHandler as (req: Http2ServerRequest, res: Http2ServerResponse) => void
            )
        }
        return new Promise((resolve, reject) => {
            server
                ?.listen(process.env.PORT, () => {
                    // server.listening
                    const address = server?.address()
                    if (address == null) {
                        logger.debug({ msg: `server listening` })
                    } else if (typeof address === 'string') {
                        logger.debug({ msg: `server listening`, address })
                    } else {
                        logger.debug({ msg: `server listening`, port: address.port })
                    }

                    resolve(server)
                })
                .on('connection', (socket: Socket) => {
                    let socketID = nextSocketID++
                    while (sockets[socketID] !== undefined) {
                        socketID = nextSocketID++
                    }
                    sockets[socketID] = socket
                    ;(socket as unknown as ISocketRequests).socketID = socketID
                    ;(socket as unknown as ISocketRequests).activeRequests = 0
                    socket.on('close', () => {
                        const socketID = (socket as unknown as ISocketRequests).socketID
                        if (socketID < nextSocketID) nextSocketID = socketID
                        sockets[socketID] = undefined
                    })
                })
                .on('request', (req: Http2ServerRequest, res: Http2ServerResponse) => {
                    if (isStopping) {
                        res.setHeader(constants.HTTP2_HEADER_CONNECTION, 'close')
                    }

                    const start = process.hrtime()
                    const socket = req.socket as unknown as ISocketRequests
                    socket.activeRequests++
                    req.on('close', () => {
                        socket.activeRequests--
                        if (isStopping) {
                            req.socket.destroy()
                        }

                        if (options.logRequest) {
                            options.logRequest(req, res)
                        } else {
                            const msg: Record<string, string | number | undefined> = {
                                msg: STATUS_CODES[res.statusCode],
                                status: res.statusCode,
                                method: req.method,
                                url: req.url,
                                ms: 0,
                            }

                            const contentType = res.getHeader('content-type')
                            if (typeof contentType === 'string') {
                                msg.content = contentType
                            }

                            const contentLength = res.getHeader('Content-Length')
                            if (typeof contentLength === 'string') {
                                msg.length = Number(contentLength)
                            }

                            const diff = process.hrtime(start)
                            const time = Math.round((diff[0] * 1e9 + diff[1]) / 10000) / 100
                            msg.ms = time

                            if (res.statusCode < 400) {
                                logger.info(msg)
                            } else if (res.statusCode < 500) {
                                logger.warn(msg)
                            } else {
                                logger.error(msg)
                            }
                        }
                    })
                })
                .on('error', (err: NodeJS.ErrnoException) => {
                    if (err.code === 'EADDRINUSE') {
                        logger.error({
                            msg: `server error`,
                            error: 'address already in use',
                            port: Number(process.env.PORT),
                        })
                        reject(undefined)
                    } else {
                        logger.error({ msg: `server error`, error: err.message })
                    }
                    if (server?.listening) server.close()
                })
        })
    } catch (err) {
        if (err instanceof Error) {
            logger.error({ msg: `server start error`, error: err.message, stack: err.stack })
        } else {
            logger.error({ msg: `server start error` })
        }
        void stopServer()
        return Promise.resolve<undefined>(undefined)
    }
}

let isStopping = false

export async function stopServer(): Promise<void> {
    if (isStopping) return
    isStopping = true

    for (const socketID of Object.keys(sockets)) {
        const socket = sockets[socketID]
        if (socket !== undefined) {
            if ((socket as unknown as ISocketRequests).activeRequests === 0) {
                socket.destroy()
            }
        }
    }

    if (server?.listening) {
        logger.debug({ msg: 'closing server' })
        if (process.env.NODE_ENV === 'production') {
            await new Promise<void>((resolve) => {
                logger.debug({ msg: 'waiting 30 sec for graceful shutdown' })
                setTimeout(
                    () =>
                        server?.close((err: Error | undefined) => {
                            if (err) {
                                logger.error({ msg: 'server close error', name: err.name, error: err.message })
                            } else {
                                logger.debug({ msg: 'server closed' })
                            }
                            resolve()
                        }),
                    25 * 1000
                )
            })
        } else {
            server?.close((err: Error | undefined) => {
                if (err) {
                    logger.error({ msg: 'server close error', name: err.name, error: err.message })
                } else {
                    logger.debug({ msg: 'server closed' })
                }
            })
        }
    }
}
