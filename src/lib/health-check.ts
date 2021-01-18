/* eslint-disable no-console */
/* eslint-disable no-process-exit */
/* istanbul ignore file */
import { request } from 'https'

request(
    {
        hostname: '0.0.0.0',
        port: process.env.PORT,
        path: '/ping',
        timeout: 1000,
        rejectUnauthorized: false,
    },
    (res) => {
        if (res.statusCode == 200) {
            process.exit(0)
        } else {
            process.exit(1)
        }
    }
)
    .on('error', function (err) {
        console.error(err)
        process.exit(1)
    })
    .end()
