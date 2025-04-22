import { edgeTypes, nodeTypes, isType } from '@/constants'
import { MultiDirectedGraph } from 'graphology'
import { bfsFromNode } from 'graphology-traversal/bfs'
import { d } from '@/grimoire/debug'

const debug = d('graph')

function createNode(node) {
    if (!node.type) debug.throw('Node type is not defined')
    if (!node.id) debug.throw('Node id is not defined')
    return node
}

export function createMain(node) {
    const {
        id,
        data: { code },
    } = node
    return createNode({
        id,
        code,
        type: nodeTypes.main,
        packageDependencies: new Set(),
        dependents: new Set(),
    })
}

export function createScript(node) {
    const {
        id,
        data: { code },
    } = node
    return createNode({
        id,
        code,
        type: nodeTypes.harmonyJsxScript,
        packageDependencies: new Set(),
        dependents: new Set(),
    })
}

export function createPackage(node) {
    const { id } = node
    return createNode({
        id,
        type: nodeTypes.jsPackage,
        dependents: new Set(),
    })
}

export function createProgram(nodes, edges) {
    const program = new MultiDirectedGraph({
        type: 'directed',
        multi: true,
    })

    // Add nodes
    const {
        [nodeTypes.main]: [source],
        [nodeTypes.harmonyJsxScript]: jsxScripts,
        [nodeTypes.jsPackage]: jsPackages,
    } = Object.groupBy(nodes, ({ type }) => type)

    program.addNode(source.id, createMain(source))
    jsxScripts.forEach((script) =>
        program.addNode(script.id, createScript(script))
    )
    jsPackages.forEach((pkg) => program.addNode(pkg.id, createPackage(pkg)))

    // Add edges
    const {
        [edgeTypes.scriptImport]: scriptImports,
        [edgeTypes.packageImport]: packageImports,
    } = Object.groupBy(edges, ({ type }) => type)

    scriptImports.forEach(({ source, target }) =>
        program.addEdge(source, target)
    )
    packageImports.forEach(({ source, target }) => {
        const src = program.getNodeAttributes(source)
        const dst = program.getNodeAttributes(target)

        // source is the script / main
        // this edge is bi-directional
        if (isType(src, nodeTypes.harmonyJsxScript, nodeTypes.main)) {
            src.packageDependencies.add(dst.id)
            dst.dependents.add(src.id)
        } else {
            dst.packageDependencies.add(src.id)
            src.dependents.add(dst.id)
        }
    })

    // Remove unreachable nodes
    shakeGraph(program, source.id)

    return program
}

function shakeGraph(graph, sourceId) {
    const reachableNodes = new Set()

    // Start BFS from the graph node (source.id)
    bfsFromNode(graph, sourceId, (node) => {
        reachableNodes.add(node)
    })

    // Identify nodes to remove
    graph
        .nodes()
        .filter((node) => !reachableNodes.has(node))
        .forEach(graph.dropNode.bind(graph))
}
