const color = (color) => `color: ${color};`
const bold = () => 'font-weight: bold;'

const log = {
    yellow: (...args) =>
        console.log('%c' + args.join(' '), color('#f0ad4e') + bold()), // warning
    red: (...args) =>
        console.log('%c' + args.join(' '), color('#d9534f') + bold()), // error
    blue: (...args) =>
        console.log('%c' + args.join(' '), color('#5bc0de') + bold()), // info
    cyan: (...args) =>
        console.log('%c' + args.join(' '), color('#17a2b8') + bold()), // debug
    gray: (...args) =>
        console.log('%c' + args.join(' '), color('#6c757d') + bold()), // neutral
}

export function d(label) {
    const prefix = `${label}: `

    function logger(...args) {
        console.log(prefix, ...args)
    }

    Object.assign(logger, {
        warn: (...args) => log.yellow('[WARN]', prefix, ...args),
        error: (msg, error) => {
            const err = error ?? new Error(msg)
            log.red('[ERROR]', prefix, msg)
            console.error(err)
        },
        throw: (msg, error) => {
            const err = error ?? new Error(msg)
            log.red('[THROW]', prefix, msg)
            console.error(err)
            throw err
        },
        info: (...args) => log.blue('[INFO]', prefix, ...args),
        log: (...args) => log.blue('[INFO]', prefix, ...args),
        debug: (...args) => log.cyan('[DEBUG]', prefix, ...args),
        trace: (fn, msg) => {
            if (fn instanceof Promise) return logger.catchPromise(fn, msg)
            try {
                const result = fn()
                if (result instanceof Promise)
                    return logger.catchPromise(result, msg)
                return result
            } catch (err) {
                logger.throw(msg, err)
            }
        },
        catchPromise: (promise, msg) =>
            promise.catch((err) => logger.throw(msg, err)),
    })

    return logger
}
