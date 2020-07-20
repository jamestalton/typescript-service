/* istanbul ignore file */
import { stopServer, startServer } from './server'
import { cpus, totalmem } from 'os'
import { logger, logLevel } from './logger'

logger.info({
    msg: `process start`,
    NODE_ENV: `${process.env.NODE_ENV}`,
    cpus: `${Object.keys(cpus()).length}`,
    memory: `${(totalmem() / (1024 * 1024 * 1024)).toPrecision(2).toString()}GB`,
    nodeVersion: `${process.versions.node}`,
    logLevel: logLevel,
})

process.on('exit', function processExit(code) {
    if (code !== 0) {
        logger.error({ msg: `process exit`, code: code })
    } else {
        logger.info({ msg: `process exit`, code: code })
    }
})

process.on('uncaughtException', (err) => {
    logger.error({ msg: `process uncaughtException`, error: err.message })
    void stopServer()
})

process.on('SIGTERM', () => {
    logger.info({ msg: 'process SIGTERM' })
    void stopServer()
})

process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.log()
    logger.debug({ msg: 'process SIGINT' })
    void stopServer()
})

process.on('multipleResolves', (type, promise, reason) => {
    logger.error({ msg: 'process multipleResolves', type })
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error({ msg: 'process unhandledRejection', reason })
})

void startServer()
