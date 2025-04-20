import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }) {
    return (
        <div className="flex h-screen w-screen">
            <SidebarProvider>
                <AppSidebar />
                <main className="h-full w-full overflow-hidden">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}
