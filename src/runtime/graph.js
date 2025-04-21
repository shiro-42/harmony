import { edgeTypes, nodeTypes, isType } from '@/constants'
import { MultiDirectedGraph } from 'graphology'
import { bfsFromNode } from 'graphology-traversal/bfs'
import { d } from '@/lib/debug'

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
    const main = new MultiDirectedGraph({
        type: 'directed',
        multi: true,
    })

    const {
        [nodeTypes.main]: [source],
        [nodeTypes.harmonyJsxScript]: jsxScripts,
        [nodeTypes.jsPackage]: jsPackages,
    } = Object.groupBy(nodes, ({ type }) => type)

    main.addNode(source.id, createMain(source))
    jsxScripts.forEach((script) =>
        main.addNode(script.id, createScript(script))
    )
    jsPackages.forEach((pkg) => main.addNode(pkg.id, createPackage(pkg)))

    const {
        [edgeTypes.scriptImport]: scriptImports,
        [edgeTypes.packageImport]: packageImports,
    } = Object.groupBy(edges, ({ type }) => type)

    scriptImports.forEach(({ source, target }) => main.addEdge(source, target))
    packageImports.forEach(({ source, target }) => {
        const src = main.getNodeAttributes(source)
        const dst = main.getNodeAttributes(target)

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

    const reachableNodes = new Set()

    // Start BFS from the main node (source.id)
    bfsFromNode(main, source.id, (node) => {
        reachableNodes.add(node)
    })

    // Identify nodes to remove
    main.nodes()
        .filter((node) => !reachableNodes.has(node))
        .forEach(main.dropNode.bind(main))

    return main
}
