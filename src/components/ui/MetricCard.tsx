'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    onClick?: () => void;
    accentColor?: string;
}

export function MetricCard({ icon: Icon, label, value, trend, trendUp = true, onClick, accentColor = 'text-app-neon' }: MetricCardProps) {
    return (
        <div
            onClick={onClick}
            className="app-card p-5 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-app-neon/10 ${accentColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-app-text mb-1 tracking-tight">{value}</p>
            <p className="text-xs text-app-text-secondary font-medium">{label}</p>
        </div>
    );
}
