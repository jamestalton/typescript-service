import { constants } from 'http2'
import { request } from '../mock-request'
const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_CREATED } = constants

describe(`Delete Collection`, function () {
    it(`DELETE /:collection should return status code 200`, async function () {
        let res = await request('PUT', '/data/collection/1', {})
        expect(res.statusCode).toEqual(HTTP_STATUS_CREATED)

        res = await request('PUT', '/data/collection/2', {})
        expect(res.statusCode).toEqual(HTTP_STATUS_CREATED)

        res = await request('DELETE', '/data/collection')
        expect(res.statusCode).toEqual(HTTP_STATUS_OK)

        res = await request('GET', '/data/collection/1')
        expect(res.statusCode).toEqual(HTTP_STATUS_NOT_FOUND)

        res = await request('GET', '/data/collection/2')
        expect(res.statusCode).toEqual(HTTP_STATUS_NOT_FOUND)
    })
})
