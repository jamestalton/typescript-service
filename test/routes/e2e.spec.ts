import { constants, Http2ServerResponse } from 'http2'
import { parseReponseJsonBody } from '../../src/lib/body-parser'
import { Event } from '../../src/lib/event-streams'
import { Item } from '../../src/lib/item'
import { request, requestEvents } from '../mock-request'
const {
    HTTP_STATUS_OK,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_CONFLICT,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_BAD_REQUEST,
} = constants

describe(`E2E Test`, function () {
    let events: Event[]
    let eventResponse: Http2ServerResponse
    let item: Item = { name: 'test' }
    let eventID = 0

    it(`GET /data/events should return status code HTTP_STATUS_OK`, async function () {
        eventResponse = await request('GET', '/data/events')
        expect(eventResponse.statusCode).toEqual(HTTP_STATUS_OK)
        events = requestEvents(eventResponse)
    })

    it(`PUT /:collection/:id should return rev 1`, async function () {
        const response = await request('PUT', '/data/collection/id', item)
        expect(response.statusCode).toEqual(HTTP_STATUS_CREATED)
        const data = await parseReponseJsonBody<Item>(response)
        item = { ...item, ...data }
        expect(typeof data.id).toEqual('string')
        expect(data.rev).toEqual(1)
        expect(events.shift()).toMatchObject({ id: ++eventID, event: 'ADD', data: { id: '1', rev: 1 } })
    })

    it(`GET /:collection/:id should return rev 1`, async function () {
        const response = await request('GET', '/data/collection/id')
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        const data = await parseReponseJsonBody<Item>(response)
        expect(typeof data.id).toEqual('string')
        expect(data.rev).toEqual(1)
        expect(data).toMatchObject(item)
    })

    it(`GET /:collection/:id/1 should return rev 1`, async function () {
        const response = await request('GET', '/data/collection/id/1')
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        const data = await parseReponseJsonBody<Item>(response)
        expect(typeof data.id).toEqual('string')
        expect(data.rev).toEqual(1)
        expect(data).toMatchObject(item)
    })

    it(`PUT /:collection/:id should return rev 2`, async function () {
        const response = await request('PUT', '/data/collection/id', item)
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        const data = await parseReponseJsonBody<Item>(response)
        expect(data).toMatchObject({ id: item.id, rev: item.rev! + 1 })
        item = { ...item, ...data }
        expect(events.shift()).toMatchObject({ id: ++eventID, event: 'PUT', data: { id: '1', rev: 2 } })
    })

    it(`GET /:collection/:id should return rev 2`, async function () {
        const response = await request('GET', '/data/collection/id')
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        const data = await parseReponseJsonBody<Item>(response)
        expect(typeof data.id).toEqual('string')
        expect(data.rev).toEqual(2)
        expect(data).toMatchObject(item)
    })

    it(`GET /:collection/:id/1 should return HTTP_STATUS_NOT_FOUND`, async function () {
        const response = await request('GET', '/data/collection/id/1')
        expect(response.statusCode).toEqual(HTTP_STATUS_NOT_FOUND)
    })

    it(`GET /:collection/:id/2 should return rev 2`, async function () {
        const response = await request('GET', '/data/collection/id/2')
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        const data = await parseReponseJsonBody<Item>(response)
        expect(typeof data.id).toEqual('string')
        expect(data.rev).toEqual(2)
        expect(data).toMatchObject(item)
    })

    it(`GET /:collection/:id/abc should return HTTP_STATUS_BAD_REQUEST`, async function () {
        const response = await request('GET', '/data/collection/id/abc')
        expect(response.statusCode).toEqual(HTTP_STATUS_BAD_REQUEST)
    })

    it(`PUT /:collection/:id should return HTTP_STATUS_CONFLICT if rev too old`, async function () {
        const response = await request('PUT', '/data/collection/id', { id: item.id, rev: 1 })
        expect(response.statusCode).toEqual(HTTP_STATUS_CONFLICT)
    })

    it(`DEL /:collection/:id should return HTTP_STATUS_OK`, async function () {
        const response = await request('DELETE', '/data/collection/id')
        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(events.shift()).toMatchObject({ id: ++eventID, event: 'DEL', data: { id: 'id' } })
    })

    it(`GET /:collection/:id should return HTTP_STATUS_NOT_FOUND`, async function () {
        const response = await request('GET', '/data/collection/id')
        expect(response.statusCode).toEqual(HTTP_STATUS_NOT_FOUND)
    })

    it(`should be able to destory the event stream`, function () {
        expect(events).toHaveLength(0)
        eventResponse.stream.destroy()
    })
})
