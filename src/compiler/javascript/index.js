export { createCompilerLoader as createCompiler }

async function createCompilerLoader(opts) {
    if (HARMONY_ENV === 'browser') {
        const { createCompiler } = await import('./browser')
        return createCompiler(opts)
    }
    if (HARMONY_ENV === 'desktop') {
        const { createCompiler } = await import('./browser')
        return createCompiler(opts)
    }
    if (HARMONY_ENV === 'mobile') {
        const { createCompiler } = await import('./browser')
        return createCompiler(opts)
    }
    if (HARMONY_ENV === 'tablet') {
        const { createCompiler } = await import('./browser')
        return createCompiler(opts)
    }
}
