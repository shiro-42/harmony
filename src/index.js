import '@/globals'
import { init, compile } from '@/runtime/esbuild'
import { namespace, pkgNamespace } from '@/constants'
import { Signal, effect } from '@/lib/signal'
import { findRoot } from '@/runtime/graph'
import { d } from '@/lib/debug'
import { initialNodes, initialEdges } from '@/initialState'

const debug = d('harmony')

const harmonyScripts = new Map()

const createScript = ({ id, data: { code } }) => ({
    id,
    code,
    scriptDeps: new Map(),
    packageDeps: new Set(),
    dependents: new Map(),
})

harmonyScripts.set('root', createScript(findRoot(initialNodes)))

const scriptImports = initialEdges.filter(
    ({ type }) => type === 'harmony-script-import'
)

for (const node of initialNodes) {
    if (node.type === 'harmony-jsx-script') {
        harmonyScripts.set(node.id, createScript(node))
    }
}

for (const edge of scriptImports) {
    const sourceScript = harmonyScripts.get(edge.source)
    const targetScript = harmonyScripts.get(edge.target)

    if (sourceScript && targetScript) {
        sourceScript.scriptDeps.set(targetScript.id, targetScript)
        targetScript.dependents.set(sourceScript.id, sourceScript)
    } else {
        debug.error(`Edge ${edge.source} -> ${edge.target} has missing scripts`)
    }
}

// TODO remove dead branches

await init(harmonyScripts)

const file = await compile(['harmony/root'])

const blob = new Blob([file], { type: 'text/javascript' })
const url = URL.createObjectURL(blob)

await import(/* @vite-ignore */ url)
