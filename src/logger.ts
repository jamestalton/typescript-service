/* eslint-disable @typescript-eslint/no-explicit-any */

// Logger abstraction interface

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
