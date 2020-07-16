import * as axios from 'axios'
import { setupBeforeAll, setupAfterAll } from './jest-setup'

let request: axios.AxiosInstance

beforeAll(() => {
    request = setupBeforeAll()
})

afterAll(setupAfterAll)

describe(`Service Routes`, function () {
    it(`GET / returns status 200 and hello world`, async function () {
        const response = await request.get(`/`)
        expect(response.data).toMatchSnapshot()
    })
})
