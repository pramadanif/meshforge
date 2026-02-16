'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { useIntents } from '@/hooks/useMeshForge';
import type { Intent } from '@/types';

type MetricsResponse = {
    settledCrossBorderCount: number;
    totalFundsMovedCusd: number;
};

export function MetricsGrid() {
    const { intents } = useIntents();
    const [metrics, setMetrics] = useState<MetricsResponse>({ settledCrossBorderCount: 0, totalFundsMovedCusd: 0 });

    useEffect(() => {
        fetch('/api/metrics')
            .then((res) => res.json())
            .then((data) => setMetrics(data))
            .catch(() => setMetrics({ settledCrossBorderCount: 0, totalFundsMovedCusd: 0 }));
    }, []);

    const validIntents = useMemo(
        () => intents.filter((intent): intent is Intent => intent !== null),
        [intents]
    );
    const completed = validIntents.filter((i) => i.status === 'completed').length;
    const active = validIntents.filter((i) => i.status === 'in_progress').length;
    const successRate = validIntents.length ? ((completed / validIntents.length) * 100) : 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                icon={DollarSign}
                label="Funds Moved"
                value={`${metrics.totalFundsMovedCusd.toFixed(2)} cUSD`}
                trend="Cross-border + local"
                trendUp={true}
            />
            <MetricCard
                icon={CheckCircle}
                label="Success Rate"
                value={`${successRate.toFixed(1)}%`}
                trend={`${completed} settled`}
                trendUp={true}
                accentColor="text-blue-600"
            />
            <MetricCard
                icon={TrendingUp}
                label="Cross-Border Settles"
                value={String(metrics.settledCrossBorderCount)}
                trend="Nairobi ↔ Uganda"
                trendUp={true}
                accentColor="text-amber-600"
            />
            <MetricCard
                icon={Zap}
                label="Active Intents"
                value={`${active} active`}
                trend={`${validIntents.length} total`}
                trendUp={true}
                accentColor="text-purple-600"
            />
        </div>
    );
}
