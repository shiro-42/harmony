export const initialNodes = [
    {
        id: 'root',
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
        type: 'harmony-jsx-script',
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
        type: 'harmony-jsx-script',
        data: {
            code: `
                console.log(math.add(2, 3)); // 5
            `,
        },
    },
    {
        id: 'ReactDOM',
        type: 'harmony-global-js-package',
    },
]

export const initialEdges = [
    {
        source: 'root',
        target: 'math',
        type: 'harmony-script-import',
    },
    {
        source: 'math',
        target: 'log',
        type: 'harmony-script-import',
    },
    {
        source: 'ReactDOM',
        target: 'root',
        type: 'harmony-package-import',
    },
]
