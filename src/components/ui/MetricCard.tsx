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

export function MetricCard({ icon: Icon, label, value, trend, trendUp = true, onClick, accentColor = 'text-brand-primary' }: MetricCardProps) {
    return (
        <div
            onClick={onClick}
            className="app-card p-6 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-b-2 hover:border-b-4"
            style={{ borderBottomColor: trendUp ? '#043915' : 'transparent' }} // Subtle hint
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-white/10 ${accentColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
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
