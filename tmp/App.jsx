import '@xyflow/react/dist/style.css'
import '@/globals.css'

import BaseLayout from '@/components/layout/base'
import { ThemeProvider } from '@/components/theme-provider'
import HarmonyEditor from '@/components/harmony-editor'

export default function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BaseLayout>
                <HarmonyEditor />
            </BaseLayout>
        </ThemeProvider>
    )
}
