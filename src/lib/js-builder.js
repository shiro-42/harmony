export function constantDeclaration(name, value) {
    return `const ${name} = ${value};`
}

export function propertyAccess(property) {
    return `['${property}']`
}
