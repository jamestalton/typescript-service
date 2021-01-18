import { Http2ServerRequest, Http2ServerResponse } from 'http2'

export function pingRoute(_req: Http2ServerRequest, res: Http2ServerResponse): void {
    res.writeHead(200).end()
}
