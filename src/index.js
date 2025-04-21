import { getComfySpace } from '@/globals'
import { initialNodes, initialEdges } from '@/initialState'
import { edgeTypes, nodeTypes, isType } from '@/constants'
import { init, compile } from '@/runtime/esbuild'
import { exec } from './runtime/loader'
import { d } from '@/lib/debug'
import { MultiDirectedGraph } from 'graphology'
import { bfsFromNode } from 'graphology-traversal/bfs'
import { createMain, createScript, createPackage } from './runtime/graph'
import { constantDeclaration, propertyAccess } from './lib/js-builder'

const debug = d('harmony')

const main = new MultiDirectedGraph({
    type: 'directed',
    multi: true,
})

function findMain(nodes) {
    const roots = nodes.find((n) => isType(n, nodeTypes.main))
    return createMain(roots)
}

const source = findMain(initialNodes)
main.addNode(source.id, source)

for (const node of initialNodes) {
    if (isType(node, nodeTypes.harmonyJsxScript)) {
        main.addNode(node.id, createScript(node))
    } else if (isType(node, nodeTypes.jsPackage)) {
        main.addNode(node.id, createPackage(node))
    }
}

for (const edge of initialEdges) {
    if (isType(edge, edgeTypes.scriptImport)) {
        main.addEdge(edge.source, edge.target)
    } else if (isType(edge, edgeTypes.packageImport)) {
        const source = main.getNodeAttributes(edge.source)
        const target = main.getNodeAttributes(edge.target)

        // source is the script / main
        // this edge is bi-directional
        if (isType(source, nodeTypes.harmonyJsxScript, nodeTypes.main)) {
            source.packageDepencies.add(target.id)
            target.dependents.add(source.id)
        } else {
            target.packageDepencies.add(source.id)
            source.dependents.add(target.id)
        }
    }
}

const reachableNodes = new Set()

// Start BFS from the main node (source.id)
bfsFromNode(main, source.id, (node) => {
    reachableNodes.add(node)
})

// Identify nodes to remove
const nodesToRemove = []
for (const node of main.nodes()) {
    if (!reachableNodes.has(node)) {
        nodesToRemove.push(node)
    }
}

// Remove unreachable nodes
for (const nodeToRemove of nodesToRemove) {
    main.dropNode(nodeToRemove)
}

const injectDependencies = ({ code, packageDepencies }) => {
    const deps = [...packageDepencies]
        .map((n) => constantDeclaration(n, getComfySpace() + propertyAccess(n)))
        .join('\n')

    return `${deps}\n${code}`
}

function scriptResolver() {
    const scripts = new Map()
    for (const { node, attributes } of main.nodeEntries())
        scripts.set(node, attributes)
    return scripts
}

await init({
    name: 'harmony',
    fetch: scriptResolver,
    onLoad: (code) => injectDependencies(code),
})

const file = await compile(['harmony/main'])

await debug.trace(() => exec(file), 'Error executing file')
