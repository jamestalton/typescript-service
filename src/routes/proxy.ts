import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { request, RequestOptions } from 'https'
import { URL } from 'url'

export function proxyRoute(route: string) {
    const url = new URL(route)
    return function proxyRouteHandler(req: Http2ServerRequest, res: Http2ServerResponse): void {
        const options: RequestOptions = {
            rejectUnauthorized: false,
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: req.method,
        }
        req.pipe(
            request(options, (response) => {
                delete response.headers.connetion
                res.writeHead(response.statusCode ?? 404, response.headers)
                response.pipe(res.stream)
            })
        )
    }
}
