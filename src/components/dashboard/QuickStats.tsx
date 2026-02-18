'use client';

import React from 'react';
import { useIntents } from '@/hooks/useMeshForge';
import type { Intent } from '@/types';

export function QuickStats() {
    const { intents } = useIntents();
    const valid = intents.filter((intent): intent is Intent => intent !== null);
    const active = valid.filter((intent) => intent.status === 'in_progress').length;
    const completed = valid.filter((intent) => intent.status === 'completed').length;

    const stats = [
        { label: 'Active Intents', value: String(active), color: 'text-app-neon' },
        { label: 'Completed', value: String(completed), color: 'text-blue-500' },
        { label: 'Indexed', value: String(valid.length), color: 'text-amber-500' },
        { label: 'Status', value: 'Onchain Live', color: 'text-emerald-500' },
    ];

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
