process.env.NODE_ENV = 'test'
process.env.LOG_LEVEL = 'silent'

import * as axios from 'axios'
import { AddressInfo } from 'net'
import * as nock from 'nock'
import { startServer, stopServer } from '../src/server'
import { Server } from 'http'
import { Http2Server, Http2SecureServer } from 'http2'

let server: Server | Http2Server | Http2SecureServer

export function setupBeforeAll(): axios.AxiosInstance {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
    nock.enableNetConnect('localhost')

    server = startServer()

    const port = (server.address() as AddressInfo).port
    return axios.default.create({
        baseURL: `http://localhost:${port}`,
        validateStatus: () => true,
    })
}

export async function setupAfterAll(): Promise<void> {
    await stopServer()
    nock.enableNetConnect()
    nock.restore()
}
