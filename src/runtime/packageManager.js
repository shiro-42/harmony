export function getPackages(initialNodes) {
    const harmonyPackages = new Map()

    for (const node of initialNodes) {
        if (node.type === 'jsPackage') {
            harmonyPackages.set(node.id, {
                name: node.data.name,
                as: node.data.as,
            })
        }
    }

    return harmonyPackages
}
