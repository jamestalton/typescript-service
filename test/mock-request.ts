import {
    constants,
    Http2ServerRequest,
    Http2ServerResponse,
    OutgoingHttpHeaders,
    ServerHttp2Stream,
    ServerStreamResponseOptions,
} from 'http2'
import { Duplex } from 'stream'
import { requestHandler } from '../src/app'
import * as nock from 'nock'

export async function mockRequest(method: 'GET', path: string): Promise<Http2ServerResponse> {
    const stream = new Duplex()
    const req = new Http2ServerRequest(
        stream as ServerHttp2Stream,
        {
            [constants.HTTP2_HEADER_METHOD]: method,
            [constants.HTTP2_HEADER_PATH]: path,
        },
        {},
        []
    )
    const res = mockResponse()
    await requestHandler(req, res)

    return res
}

export function mockResponse(): Http2ServerResponse {
    const stream = new Duplex() as ServerHttp2Stream
    const res = new Http2ServerResponse(stream)
    stream.respond = (headers?: OutgoingHttpHeaders, _options?: ServerStreamResponseOptions) => {
        if (headers) {
            res.statusCode = Number(headers[constants.HTTP2_HEADER_STATUS])
        }
    }
    return res
}

beforeAll(nock.disableNetConnect)
