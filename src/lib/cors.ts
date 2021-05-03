/* istanbul ignore file */

import { Http2ServerRequest, Http2ServerResponse, constants } from 'http2'

export function handleCors(req: Http2ServerRequest, res: Http2ServerResponse): void {
    if (process.env.NODE_ENV !== 'production') {
        if (req.headers['origin']) {
            res.setHeader(constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, req.headers['origin'])
            res.setHeader(constants.HTTP2_HEADER_VARY, 'Origin, Access-Control-Allow-Origin')
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        switch (req.method) {
            case 'OPTIONS':
                if (req.headers['access-control-request-method']) {
                    res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
                }
                if (req.headers['access-control-request-headers']) {
                    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
                }
                return res.writeHead(200).end()
        }
    }
}
