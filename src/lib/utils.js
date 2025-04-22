import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function stripExtensions(path, ...extensions) {
    for (const ext of extensions) {
        if (path.endsWith(ext)) {
            return path.slice(0, -ext.length)
        }
    }
    return path
}
