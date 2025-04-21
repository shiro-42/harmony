import * as esbuild from 'esbuild-wasm'
import wasmURL from '@/assets/esbuild.wasm?url'
import { namespace } from '@/constants'
import { d } from '@/lib/debug'
import { checksum } from '@/lib/crypto'

const debug = d('esbuild')

let folderName
let initialized = false
let plugin
let scriptLoader
let onLoad

export async function init(opts) {
    debug.info('Initializing esbuild')
    // Initialize esbuild
    await debug.trace(
        () => esbuild.initialize({ wasmURL }),
        'error initializing esbuild'
    )
    folderName = opts.name
    scriptLoader = opts.fetch
    onLoad = opts.onLoad
    plugin = harmonyLoader()
    initialized = true
}

function harmonyLoader() {
    return {
        name: 'harmony-loader',
        setup(build) {
            // Intercept import paths starting with /virtual/
            const regex = new RegExp(`^${folderName}/`)

            build.onResolve({ filter: regex }, (args) => ({
                path: args.path,
                namespace,
            }))
            // Provide the file contents from our virtualFiles object
            build.onLoad({ filter: /.*/, namespace }, ({ path }) => {
                if (!path.startsWith(`${folderName}/`)) return null
                const contents = scriptLoader().get(path.slice(8))
                if (contents) {
                    return { contents: onLoad(contents), loader: 'jsx' }
                }
                return null
            })
        },
    }
}

function getBuildOptions() {
    return {
        format: 'esm',
        plugins: [plugin],
        write: false,
        bundle: true,
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
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

export async function compile(entryPoints) {
    const buildOptions = {
        ...getBuildOptions(),
        entryPoints,
    }
    const result = await debug.trace(
        () => esbuild.build(buildOptions),
        'error during esbuild build'
    )

    validateBuildResult(result)

    return result.outputFiles[0].text
}
