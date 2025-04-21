export function constantDeclaration(name, value) {
    return `const ${name} = ${value};`
}

export function propertyAccess(target, p) {
    return `${target}${property(p)}`
}

export const property = (p) => `['${p}']`

export const declaration = {
    constant({ name, value }) {
        return constantDeclaration(name, value)
    },
    propertyAccess: propertyAccess,
}

export const line = (l) => `${l};`
export const lines = (ll) => ll.join('\n')
export const string = (s, style = "'") => `${style}${s}${style}`

export const js = {
    lines,
    declaration,
    prop: property,
}
