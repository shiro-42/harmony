import React from 'react'
import ReactDOM from 'react-dom/client'
import * as esbuild from 'esbuild-wasm'
import wasmURL from '@/assets/esbuild.wasm?url'

const initialNodes = [
    {
        type: 'root',
        data: {
            code: `
            import { add } from 'harmony/math'

            console.log('from main');
            console.log(add(2, 3)); // 5
            function App() {
                return (
                    <div>
                        <h1>Hello, world!</h1>
                    </div>
                )
            }
            console.log(App);
            const root = document.getElementById('root')
            console.log(React)
            ReactDOM.createRoot(root).render(
                    <App />
            )
        `,
        },
    },
    {
        id: 'math',
        type: 'jsModule',
        data: {
            code: `
                console.log('Hello, world!');

                export const add = (a, b) => {
                    return a + b;
                }
            `,
        },
    },
    {
        id: 'log',
        type: 'jsModule',
        data: {
            code: `
                console.log(math.add(2, 3)); // 5
            `,
        },
    },
]

const initialEdges = [
    {
        source: '1',
        target: 'math',
        type: 'harmony-script-import',
    },
    {
        source: 'math',
        target: 'log',
        type: 'harmony-script-import',
    },
]

const harmonyScripts = new Map()

const createScriptFromNode = ({ id, data: { code } }) => ({
    id,
    code,
    scriptDeps: new Map(),
    packageDeps: new Set(),
})

for (const node of initialNodes) {
    if (node.type === 'root') {
        harmonyScripts.set('root', createScriptFromNode(node))
    } else if (node.type === 'jsModule') {
        harmonyScripts.set(node.id, createScriptFromNode(node))
    }
}

// TODO remove dead branches

const harmonyNamespace = '__HARMONY__'
const pkgNamespace = `${harmonyNamespace}PACKAGES__`
window[pkgNamespace] = {}

const importMap = {
    ReactDOM,
}
window[pkgNamespace] = importMap

// Import React everywhere esbuild is annoying otherwise
window.React = React

const injectDependencies = (code) => {
    const deps = Object.keys(importMap).map(
        (as) => `const ${as} = window['${pkgNamespace}']['${as}']`
    )
    console.log(deps)

    return deps.join('\n') + '\n' + code
}

const harmonyLoader = {
    name: 'harmony-loader',
    setup(build) {
        // Intercept import paths starting with /virtual/
        build.onResolve({ filter: /^harmony\// }, (args) => ({
            path: args.path,
            namespace: 'harmony',
        }))
        // Provide the file contents from our virtualFiles object
        build.onLoad({ filter: /.*/, namespace: 'harmony' }, ({ path }) => {
            if (!path.startsWith('harmony/')) return null
            const scriptNode = harmonyScripts.get(path.slice(8))
            if (scriptNode && scriptNode.code) {
                const contents = injectDependencies(scriptNode.code)
                return { contents, loader: 'jsx' }
            }
            return null
        })
    },
}

async function init() {
    // Initialize esbuild
    await esbuild.initialize({ wasmURL })
}
await init()

const result = await esbuild.build({
    format: 'esm',
    plugins: [harmonyLoader],
    write: false,
    bundle: true,
    entryPoints: ['harmony/root'],
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
})

const blob = new Blob([result.outputFiles[0].text], { type: 'text/javascript' })
const url = URL.createObjectURL(blob)

await import(url)
