/* istanbul ignore file */

// Pino is a very fast logger for Node.js

// process.env.LOG_LEVEL can be one of "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent"

import * as pino from 'pino'

const options: pino.LoggerOptions = {
    safe: false,
    useLevelLabels: true,
    base: {
        app: process.env.APP,
        instance: process.pid,
        region: process.env.REGION,
        version: process.env.VERSION,
    },
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
}

// For production we enable the use of buffer streams for performance
let stream: pino.DestinationStream
let timeout: NodeJS.Timeout
if (process.env.NODE_ENV === 'production') {
    stream = pino.extreme()
    timeout = setInterval(function loggerFlush() {
        logger.flush()
    }, 5 * 1000)
}

export const logger: pino.Logger = pino(options, stream)

export function loggerShutdown(): void {
    if (timeout != undefined) {
        clearInterval(timeout)
        timeout = undefined
    }
    if (stream != undefined) {
        pino.final(logger, (err, finalLogger, evt) => {
            if (err) finalLogger.error(err, 'error caused exit')
            finalLogger.flush()
        })(undefined)
    }
}
