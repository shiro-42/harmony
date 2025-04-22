export async function exec(...files) {
    const blob = new Blob(files, { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)

    return await import(/* @vite-ignore */ url)
}
