'use client';

import React from 'react';
import { DollarSign, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';

export function MetricsGrid() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                icon={DollarSign}
                label="Today's Volume"
                value="$3.47"
                trend="+$2.10 vs avg"
                trendUp={true}
            />
            <MetricCard
                icon={CheckCircle}
                label="Success Rate"
                value="98.2%"
                trend="1 pending"
                trendUp={true}
                accentColor="text-blue-600"
            />
            <MetricCard
                icon={TrendingUp}
                label="Reputation This Week"
                value="4.7 → 4.9"
                trend="+3 agents"
                trendUp={true}
                accentColor="text-amber-600"
            />
            <MetricCard
                icon={Zap}
                label="Active Intents"
                value="2 active"
                trend="5 available"
                trendUp={true}
                accentColor="text-purple-600"
            />
        </div>
    );
}
