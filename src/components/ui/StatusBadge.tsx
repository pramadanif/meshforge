'use client';

import React from 'react';
import { IntentStatus, AgentStatus } from '@/types';

const intentColors: Record<IntentStatus, { bg: string; text: string; dot: string }> = {
    open: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    accepted: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    disputed: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    expired: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
};

const agentColors: Record<AgentStatus, { bg: string; text: string; dot: string }> = {
    online: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    offline: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    busy: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
};

const labels: Record<string, string> = {
    open: 'Open',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    disputed: 'Disputed',
    expired: 'Expired',
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
};

export function StatusBadge({ status, type = 'intent' }: { status: IntentStatus | AgentStatus; type?: 'intent' | 'agent' }) {
    const colors = type === 'intent'
        ? intentColors[status as IntentStatus]
        : agentColors[status as AgentStatus];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
            {labels[status]}
        </span>
    );
}
