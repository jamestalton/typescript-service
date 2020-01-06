/* istanbul ignore file */

import { shutdown, start } from './start'
import { cpus, totalmem } from 'os'
import { logger } from './logger'

logger.info({
    msg: `process start`,
    NODE_ENV: `${process.env.NODE_ENV}`,
    cpus: `${Object.keys(cpus()).length}`,
    memory: `${(totalmem() / (1024 * 1024 * 1024)).toPrecision(2).toString()}GB`,
    nodeVersion: `${process.versions.node}`
})

process.on('exit', function processExit(code) {
    if (code !== 0) {
        logger.error({ msg: `process exit`, code: code })
    } else {
        logger.info({ msg: `process exit`, code: code })
    }
})

process.on('uncaughtException', err => {
    logger.error({ msg: `process uncaughtException`, error: err.message })
    logger.debug({ msg: 'uncaughtException stack', stack: err.stack })
    void shutdown()
})

process.on('SIGTERM', () => {
    logger.info({ msg: 'process SIGTERM' })
    void shutdown()
})

process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.log()
    logger.debug({ msg: 'process SIGINT' })
    void shutdown()
})

process.on('SIGILL', () => {
    logger.debug({ msg: 'process SIGILL' })
    void shutdown()
})

process.on('SIGBUS', () => {
    logger.error({ msg: 'process SIGBUS' })
    void shutdown()
})

process.on('SIGFPE', () => {
    logger.error({ msg: 'process SIGFPE' })
    void shutdown()
})

process.on('SIGSEGV', () => {
    logger.error({ msg: 'process SIGSEGV' })
    void shutdown()
})

void start()
