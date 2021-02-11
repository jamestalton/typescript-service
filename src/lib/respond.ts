import { Http2ServerResponse, constants } from 'http2'

const {
    HTTP_STATUS_OK,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_CREATED,
    // HTTP_STATUS_UNAUTHORIZED,
    // HTTP_STATUS_METHOD_NOT_ALLOWED,
    // HTTP_STATUS_NO_CONTENT,
    // HTTP_STATUS_NOT_MODIFIED,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CONFLICT,
} = constants

export function respond(res: Http2ServerResponse, data: unknown): void {
    let jsonString: string
    if (typeof data === 'string') {
        jsonString = data
    } else if (data instanceof Buffer) {
        jsonString = data.toString()
    } else {
        jsonString = JSON.stringify(data)
    }

    if (jsonString.length > 1000) {
        // TODO COMPrESSION
    }
    // TODO ETAG
    // CONteNT LENGTH
    res.writeHead(HTTP_STATUS_OK, { 'content-type': 'application/json' }).end(jsonString)
}

export function respondOK(res: Http2ServerResponse): void {
    res.writeHead(HTTP_STATUS_OK).end()
}

export function respondCreated(res: Http2ServerResponse, data: Record<string, unknown>): void {
    if (data) {
        res.writeHead(HTTP_STATUS_CREATED, { 'content-type': 'application/json' }).end(JSON.stringify(data))
    } else {
        res.writeHead(HTTP_STATUS_CREATED).end()
    }
}

export function respondBadRequest(res: Http2ServerResponse): void {
    res.writeHead(HTTP_STATUS_BAD_REQUEST).end()
}

export function respondNotFound(res: Http2ServerResponse): void {
    res.writeHead(HTTP_STATUS_NOT_FOUND).end()
}

export function respondConflict(res: Http2ServerResponse): void {
    res.writeHead(HTTP_STATUS_CONFLICT).end()
}

export function respondInternalServerError(res: Http2ServerResponse): void {
    res.writeHead(500).end()
}

// import { STATUS_CODES } from 'http'
// import { constants } from 'http2'
// import { Response } from '../server'

// const {
//     HTTP_STATUS_NOT_FOUND,
//     HTTP_STATUS_UNAUTHORIZED,
//     HTTP_STATUS_METHOD_NOT_ALLOWED,
//     HTTP_STATUS_CREATED,
//     HTTP_STATUS_OK,
//     HTTP_STATUS_NO_CONTENT,
//     HTTP_STATUS_NOT_MODIFIED,
//     HTTP_STATUS_BAD_REQUEST,
// } = constants

// export function send(data: unknown, res: Response, status = 200): void {
//     const json = JSON.stringify(data)
//     //TODOonly if GET add cache-control
//     res.writeHead(status, {
//         'Content-Type': 'application/json',
//         'Content-Length': json.length,
//         // 'Cache-Control': 'no-store',
//     })
//     res.end(json)
// }

// export function sendUnauthorized(res: Response): void {
//     // res.writeHead(401, {
//     //     'WWW-Authenticate': 'Basic realm=Authorization Required'
//     // })
//     res.writeHead(HTTP_STATUS_UNAUTHORIZED)
//     res.end()
// }

// export function sendNotFound(res: Response): void {
//     res.writeHead(HTTP_STATUS_NOT_FOUND)
//     res.end()
// }

// export function sendMethodNotAllowed(res: Response): void {
//     res.writeHead(HTTP_STATUS_METHOD_NOT_ALLOWED)
//     res.end()
// }

// export function sendCreated(res: Response, data?: unknown): void {
//     if (data) {
//         send(data, res, HTTP_STATUS_CREATED)
//     } else {
//         res.writeHead(HTTP_STATUS_CREATED).end()
//     }
// }

// export function sendOk(res: Response): void {
//     res.writeHead(HTTP_STATUS_OK).end()
// }

// export function sendNoContent(res: Response): void {
//     res.writeHead(HTTP_STATUS_NO_CONTENT).end()
// }

// export function sendNotModified(res: Response): void {
//     res.writeHead(HTTP_STATUS_NOT_MODIFIED).end()
// }

// export function sendBadRequest(res: Response, message?: string): void {
//     sendError(res, HTTP_STATUS_BAD_REQUEST, message)
// }

// export function sendInternalServerError(res: Response, message?: string): void {
//     sendError(res, 500, message)
// }

// export function sendForbidden(res: Response): void {
//     sendError(res, 403)
// }

// export function sendError(res: Response, status: number, message?: string): void {
//     send(
//         {
//             status: status,
//             error: STATUS_CODES[status],
//             message: message,
//         },
//         res,
//         status
//     )
// }
