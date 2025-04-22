import { getComfySpace } from '@/globals'
import { initialNodes, initialEdges } from '@/initialState'
import { exec } from './grimoire/loader'
import { d } from '@/grimoire/debug'
import { createProgram } from './runtime/graph'
import { js } from './grimoire/js-builder'
import { createCompiler } from './compilers/javascript'

const debug = d('harmony')

// Create a program graph from the initial nodes and edges
const main = createProgram(initialNodes, initialEdges)

/**
 * Injects package dependencies as constants into JavaScript code.
 * Example output:
 * ```js
 * const ReactDOM = window[harmonyNamespace]['ReactDOM']
 *
 * @param {Object} options - The options object.
 * @param {string} options.code - The original JavaScript code.
 * @param {Map|Iterable} options.packageDependencies - Map of dependencies to inject.
 * @returns {string} The modified code with injected dependencies.
 */
function injectDependencies({ code, packageDependencies }) {
    const deps = Iterator.from(packageDependencies).map(toInjectedConstant)
    return js.lines([...deps, code])
}

/**
 * Converts a given name into a constant declaration with an injected value.
 * The value is constructed by concatenating the result of getComfySpace() and
 * accessing a property matching the provided name.
 *
 * @param {string} name - The name to be used for both the constant declaration and property access
 * @returns {Object} A JavaScript constant declaration object
 */
const toInjectedConstant = (name) =>
    js.declaration.constant({
        name,
        value: getComfySpace() + js.prop(name),
    })

const getScriptMap = (program) => {
    return Iterator.from(program.nodeEntries()).map(({ node, attributes }) => [
        node,
        injectDependencies(attributes),
    ])
}

const scriptResolver = (program) => () => new Map(getScriptMap(program))

const runtime = {
    name: 'harmony',
    fetch: scriptResolver(main),
}

const compile = await debug.trace(
    createCompiler(runtime),
    'Error creating compiler'
)
const file = await debug.trace(compile(['main']), 'Error compiling file')
await debug.trace(exec(file), 'Error executing file')
