import * as axios from 'axios'
import { setupBeforeAll, setupAfterAll } from './jest-setup'

let request: axios.AxiosInstance

beforeAll(() => {
    request = setupBeforeAll()
})

afterAll(setupAfterAll)

describe(`Service Routes`, function () {
    it(`GET / returns status 200 and hello world`, async function () {
        await expect(request.get(`/`)).resolves.toMatchObject({
            status: 200,
            headers: {
                'content-type': 'application/json',
                'content-length': '25',
            },
            data: {
                message: 'Hello World',
            },
        })
    })
})
