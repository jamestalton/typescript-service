import * as axios from 'axios'
import { AddressInfo } from 'net'
import * as nock from 'nock'
import { start, shutdown } from '../src/start'
import { STATUS_CODES, Server } from 'http'

let server: Server
let request: axios.AxiosInstance

beforeAll(function() {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
    nock.enableNetConnect('localhost')

    server = start()

    const port = (server.address() as AddressInfo).port
    request = axios.default.create({
        baseURL: `http://localhost:${port}`,
        validateStatus: () => true
    })
})

afterAll(async function() {
    await shutdown()
    nock.enableNetConnect()
    nock.restore()
})

describe(`Service Routes`, function() {
    it(`GET / returns status 200 and hello world`, async function() {
        await expect(request.get(`/`)).resolves.toMatchObject({
            status: 200,
            headers: {
                'content-type': 'application/json',
                'content-length': '25'
            },
            data: {
                message: 'Hello World'
            }
        })
    })
})
