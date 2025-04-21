import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'
import path from 'node:path'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [wasm(), react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // alias `@` to `src`
        },
    },
    clearScreen: false, // prevent vite from obscuring rust errors
    server: {
        port: 1420, // tauri expects a fixed port, fail if that port is not available
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: 'ws',
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            ignored: ['**/src-tauri/**', '**/src-server/**', '**/tmp/**'], // tell vite to ignore watching `src-tauri`
        },
    },
}))
