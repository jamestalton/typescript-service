import * as axios from 'axios'
import { Http2Server } from 'http2'
import { Agent } from 'https'
import { AddressInfo } from 'net'
import * as nock from 'nock'
import { start, shutdown } from '../src/start'
import { STATUS_CODES } from 'http'

let server: Http2Server
let request: axios.AxiosInstance

beforeAll(async function() {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
    nock.enableNetConnect('localhost')

    server = await start()

    const port = (server.address() as AddressInfo).port
    request = axios.default.create({
        baseURL: `https://localhost:${port}`,
        validateStatus: () => true,
        httpsAgent: new Agent({
            rejectUnauthorized: false
        })
    })
})

afterAll(async function() {
    await shutdown()
    nock.enableNetConnect()
    nock.restore()
})

describe(`Server should return`, function() {
    it(`GET /test return status 200 "${STATUS_CODES[200]}"`, async function() {
        const response = await request.get(`/test`)
        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toEqual('application/json')
        expect(response.headers['content-encoding']).toBeUndefined()
        expect(response.headers).toHaveProperty('content-length')
        expect(response.data).toHaveProperty('method')
        expect(response.data.method).toEqual('GET')
        expect(response.data).toHaveProperty('url')
        expect(response.data.url).toEqual('/test')
    })
})
