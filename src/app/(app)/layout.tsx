import { AppHeader } from '@/components/app/AppHeader';
import { Sidebar } from '@/components/app/Sidebar';
import { BottomNav } from '@/components/app/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-app-bg text-app-text">
            <AppHeader />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
                    {children}
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
