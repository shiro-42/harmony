import * as esbuild from 'esbuild-wasm'
import wasmURL from '@/runes/esbuild.wasm?url'
import { namespace } from '@/constants'
import { d } from '@/grimoire/debug'

const debug = d('esbuild')

export async function createCompiler(opts = {}) {
    const folderName = opts.name
    const getStore = opts.fetch

    debug.info('Initializing esbuild-wasm')

    await debug.trace(
        esbuild.initialize({ wasmURL }),
        'error initializing esbuild'
    )

    // getStore() -> Promise<Map<string, string>>
    function harmonyLoaderPlugin(getStore) {
        return {
            name: 'harmony-loader',
            setup(build) {
                // Intercept import paths starting with folderName/
                const filter = RegExp(`^${folderName}/`)

                build.onResolve({ filter }, (args) => ({
                    path: args.path,
                    namespace,
                }))
                // Provide the file contents from our virtualFiles object
                build.onLoad({ filter, namespace }, async ({ path }) => {
                    debug.info('onLoad', path)
                    const virtualPath = path.slice(8)
                    const store = await getStore()
                    const contents = store.get(virtualPath)
                    if (!contents) debug.throw('file not found', virtualPath)
                    return { contents: contents, loader: 'jsx' }
                })
            },
        }
    }

    return async function compile(ids) {
        const entryPoints = ids.map((id) => `${folderName}/${id}`)
        const plugin = harmonyLoaderPlugin(getStore)
        const buildOptions = {
            format: 'esm',
            plugins: [plugin],
            write: false,
            bundle: true,
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            entryPoints,
        }

        const result = await debug.trace(
            esbuild.build(buildOptions),
            'error during esbuild build'
        )

        validateBuildResult(result)

        const bundle = result.outputFiles[0].text

        return bundle
    }
}

function validateBuildResult(result = {}) {
    const { errors = [], warnings = [], outputFiles = [] } = result

    if (errors.length > 0) {
        debug.throw('build failed', errors)
    } else if (warnings.length > 0) {
        debug.warn('build warnings', warnings)
    } else if (outputFiles.length === 0) {
        debug.throw('build: no output files generated', result)
    }
}
