import { getComfySpace } from '@/globals'
import { initialNodes, initialEdges } from '@/initialState'
import { init, compile } from '@/runtime/esbuild'
import { exec } from './runtime/loader'
import { d } from '@/lib/debug'
import { createProgram } from './runtime/graph'
import { js } from './lib/js-builder'

const debug = d('harmony')

// Create a program graph from the initial nodes and edges
const main = createProgram(initialNodes, initialEdges)

/**
 * Injects dependencies into the code.
 * Example output:
 * ```js
 * const ReactDOM = window[harmonyNamespace]['ReactDOM']
 *
 * // rest of the code
 */
const injectDependencies = ({ code, packageDependencies }) => {
    const deps = Iterator.from(packageDependencies).map(toInjectedConstant)
    return js.lines([...deps, code])
}

const toInjectedConstant = (name) =>
    js.declaration.constant({
        name,
        value: getComfySpace() + js.prop(name),
    })

const getScriptMap = (program) => {
    return Iterator.from(program.nodeEntries()).map(({ node, attributes }) => [
        node,
        attributes,
    ])
}

const scriptResolver = (program) => () => new Map(getScriptMap(program))

const runtime = {
    name: 'harmony',
    fetch: scriptResolver(main),
    onLoad: injectDependencies,
}

await debug.trace(init(runtime), 'Error initializing esbuild')
const file = await debug.trace(compile(['main']), 'Error compiling file')
await debug.trace(exec(file), 'Error executing file')
