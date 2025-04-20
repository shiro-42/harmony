export function findRoot(nodes) {
    let root
    let rCount = 0

    for (const node of nodes) {
        if (node.type === 'root') {
            root = node
            rCount++
        }
    }
    if (rCount > 1) {
        throw new Error('Multiple root nodes found')
    }
    return root
}
