import { nodeTypes } from '@/constants'

export const createMain = (node) => {
    const {
        id,
        data: { code },
    } = node

    return {
        id,
        code,
        type: nodeTypes.main,
        packageDepencies: new Set(),
        dependents: new Set(),
    }
}

export const createScript = (node) => {
    const {
        id,
        data: { code },
    } = node
    return {
        id,
        code,
        type: nodeTypes.harmonyJsxScript,
        packageDepencies: new Set(),
        dependents: new Set(),
    }
}

export const createPackage = (node) => {
    const { id } = node
    return {
        id,
        type: nodeTypes.jsPackage,
        dependents: new Set(),
    }
}
