/* eslint-disable @typescript-eslint/no-explicit-any */

// Logger abstraction

/**
 * Logger abstraction interface
 *
 * This interface abstracts the logger so that it can be hooked to any of the popular loggers out there.
 * By default it logs to the console as the logger.
 *
 */
export interface ILogger {
    debug: (message: any) => any
    info: (message: any) => any
    warn: (message: any) => any
    error: (message: any) => any
}

function noop(): void {
    // Do nothing
}

export let logger: ILogger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop
}

export function setLogger(newLogger: ILogger): void {
    logger = newLogger
}

if (process.env.LOG_LEVEL != 'none') {
    setLogger(console)
}
