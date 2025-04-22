import { nodeTypes, edgeTypes } from './constants'
import { stripExtensions } from './lib/utils'

const rawFiles = import.meta.glob('./ui/*', { query: '?raw' })

const fp = {}
for (const [path, load] of Object.entries(rawFiles)) {
    const { default: content } = await load()
    const prop = stripExtensions(path.slice(5), '.jsx', '.js')
    fp[prop] = content
}

export const initialNodes = [
    {
        id: 'main',
        type: nodeTypes.main,
        data: {
            code: fp.app,
        },
    },
    {
        id: 'math',
        type: nodeTypes.harmonyJsxScript,
        data: {
            code: fp.app2,
        },
    },
    {
        id: 'log',
        type: nodeTypes.harmonyJsxScript,
        data: {
            code: `
                console.log(math.add(2, 3)); // 5
            `,
        },
    },
    {
        id: 'ReactDOM',
        type: nodeTypes.jsPackage,
    },
]

export const initialEdges = [
    {
        type: edgeTypes.scriptImport,
        source: 'main',
        target: 'math',
    },
    {
        type: edgeTypes.scriptImport,
        source: 'math',
        target: 'log',
    },
    {
        type: edgeTypes.packageImport,
        source: 'ReactDOM',
        target: 'main',
    },
]
