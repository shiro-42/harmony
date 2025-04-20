import * as esbuild from 'esbuild-wasm'
import wasmURL from '@/assets/esbuild.wasm?url'
import { namespace, pkgNamespace } from '@/constants'
import { d } from '@/lib/debug'

const debug = d('esbuild')

let initialized = false
let plugin
let dependencies = ['ReactDOM']

export async function init(harmonyScripts) {
    debug.info('Initializing esbuild')
    // Initialize esbuild
    await debug.trace(
        () => esbuild.initialize({ wasmURL }),
        'error initializing esbuild'
    )
    plugin = harmonyLoader(harmonyScripts)
    initialized = true
}

export function harmonyLoader(harmonyScripts) {
    return {
        name: 'harmony-loader',
        setup(build) {
            // Intercept import paths starting with /virtual/
            build.onResolve({ filter: /^harmony\// }, (args) => ({
                path: args.path,
                namespace,
            }))
            // Provide the file contents from our virtualFiles object
            build.onLoad({ filter: /.*/, namespace }, ({ path }) => {
                if (!path.startsWith('harmony/')) return null
                const scriptNode = harmonyScripts.get(path.slice(8))
                if (scriptNode && scriptNode.code) {
                    const contents = injectDependencies(
                        scriptNode.code,
                        dependencies
                    )
                    return { contents, loader: 'jsx' }
                }
                return null
            })
        },
    }
}

function createConstVar(name) {
    return `const ${name} = window['${pkgNamespace}']['${name}']`
}

const injectDependencies = (code, depies) => {
    const deps = depies.map(createConstVar).join('\n')

    return deps + '\n' + code
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
        debug.error('build failed', errors)
    } else if (warnings.length > 0) {
        debug.warn('build warnings', warnings)
    } else if (outputFiles.length === 0) {
        debug.error('build: no output files generated', result)
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
