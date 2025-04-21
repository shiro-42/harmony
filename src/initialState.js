import { nodeTypes, edgeTypes } from './constants'

export const initialNodes = [
    {
        id: 'main',
        type: nodeTypes.main,
        data: {
            code: `
            import { App } from 'harmony/math'

            const root = document.getElementById('root')
            ReactDOM.createRoot(root).render(
                    <App />
            )
        `,
        },
    },
    {
        id: 'math',
        type: nodeTypes.harmonyJsxScript,
        data: {
            code: `
                export function App() {
                    return (
                        <div>
                            <h1>Hello, world!</h1>
                        </div>
                    )
                }
            `,
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
        type: nodeTypes.harmonyPackage,
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
