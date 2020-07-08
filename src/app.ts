import { logger } from './logger'
import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'

export function handleRequest(
    req: IncomingMessage | Http2ServerRequest,
    res: ServerResponse | Http2ServerResponse
): void {
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
