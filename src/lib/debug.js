import { red } from 'console-log-colors'
import { yellow } from 'console-log-colors'

const log = {
    yellow: (...args) => {
        console.log('%c' + args.join(' '), 'color: #f0ad4e; font-weight: bold;')
    },
    red: (...args) => {
        console.log('%c' + args.join(' '), 'color: #d9534f; font-weight: bold;')
    },
    blue: (...args) => {
        console.log('%c' + args.join(' '), 'color: #5bc0de; font-weight: bold;')
    },
    cyan: (...args) => {
        console.log('%c' + args.join(' '), 'color: #5bc0de; font-weight: bold;')
    },
    gray: (...args) => {
        console.log('%c' + args.join(' '), 'color: #ccc; font-weight: bold;')
    },
}

export function d(label) {
    label = label + ': '
    const logger = {
        warn: (...args) => {
            log.yellow(label, ...args)
        },
        error: (msg, error) => {
            error ??= new Error(msg)
            log.red(label, msg, '=>', error)
            console.error(e)
            throw e
        },
        info: (...args) => {
            log.blue(label, ...args)
        },
        debug: (...args) => {
            log.cyan(label, ...args)
        },
        trace: (fn, msg) => {
            try {
                const res = fn()

                if (res instanceof Promise) {
                    return res.catch((error) => logger.error(msg, error))
                } else {
                    return res
                }
            } catch (e) {
                logger.error(msg, e)
            }
        },
    }
    return logger
}
