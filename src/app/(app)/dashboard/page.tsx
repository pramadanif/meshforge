import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickStats } from '@/components/dashboard/QuickStats';

export default function DashboardPage() {
    return (
        <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
            <WelcomeCard />
            <MetricsGrid />
            <ActivityFeed />
            <QuickStats />
        </div>
    );
}
