export const namespace = '__HARMONY__'

export const nodeTypes = {
    main: 'harmony-jsx-main',
    harmonyJsxScript: 'harmony-jsx-script',
    harmonyPackage: 'harmony-global-js-package',
    jsPackage: 'harmony-global-js-package',
}

export const edgeTypes = {
    scriptImport: 'harmony-script-import',
    packageImport: 'harmony-package-import',
}

export function isType(target, ...types) {
    return types.includes(target.type)
}
