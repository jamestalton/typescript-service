/* istanbul ignore file */

import * as pino from 'pino'

const options: pino.LoggerOptions = {
    safe: false,
    base: {
        app: process.env.APP,
        instance: process.pid,
        region: process.env.REGION,
        version: process.env.VERSION,
    },
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
    formatters: {
        level(label: string, number: number) {
            return { level: label }
        },
    },
}

let stream: pino.DestinationStream
let timeout: NodeJS.Timeout
if (process.env.NODE_ENV === 'production') {
    stream = pino.destination({ sync: false })
    timeout = setInterval(function loggerFlush() {
        logger.flush()
    }, 5 * 1000)
}

export const logger: pino.Logger = pino(options, stream)

export function stopLogger(): void {
    if (timeout != undefined) {
        clearInterval(timeout)
        timeout = undefined
    }
    if (stream != undefined) {
        pino.final(logger, (err, finalLogger, evt) => {
            if (err) finalLogger.error(err, 'error caused exit')
            finalLogger.flush()
        })(undefined)
        stream = undefined
    }
}

switch (process.env.LOG_LEVEL) {
    case 'trace':
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
    case 'fatal':
    case 'silent':
        break
    case undefined:
        logger.info({ msg: 'LOG_LEVEL not specified', level: 'debug' })
        break
    default:
        logger.info({ msg: 'Unknown LOG_LEVEL', level: process.env.LOG_LEVEL })
        break
}

export const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug'
