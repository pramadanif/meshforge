'use client';

import React from 'react';

const stats = [
    { label: 'Active Intents', value: '2', color: 'text-app-neon' },
    { label: 'Completed Today', value: '5', color: 'text-blue-400' },
    { label: 'Reputation', value: '4.7', color: 'text-amber-400' },
    { label: 'Status', value: 'Online', color: 'text-emerald-400' },
];

export function QuickStats() {
    return (
        <div className="app-card px-5 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {stats.map(({ label, value, color }, i) => (
                <React.Fragment key={label}>
                    {i > 0 && <span className="hidden sm:block w-px h-4 bg-app-border" />}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-app-text-secondary font-medium">{label}:</span>
                        <span className={`text-sm font-bold ${color}`}>{value}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
