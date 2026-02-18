'use client';

import React, { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { apiUrl } from '@/lib/api';

type Activity = {
    id: string;
    title: string;
    description: string;
    txHash?: string | null;
    timestamp: string;
};

export function ActivityFeed() {
    const [items, setItems] = useState<Activity[]>([]);

    useEffect(() => {
        fetch(apiUrl('/api/activity'))
            .then((res) => res.json())
            .then((data) => setItems(data.items ?? []))
            .catch(() => setItems([]));
    }, []);

    return (
        <div className="app-card overflow-hidden">
            <div className="px-5 py-4 border-b border-app-border flex items-center justify-between">
                <h3 className="text-base font-bold text-app-text">Live Activity</h3>
                <span className="text-xs text-app-text-secondary font-medium">Live</span>
            </div>
            <div className="divide-y divide-app-border max-h-[400px] overflow-y-auto app-scrollbar">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors"
                    >
                        <div className="p-2 rounded-xl bg-white/10 border border-app-border flex-shrink-0 mt-0.5">
                            <Clock3 className="w-4 h-4 text-brand-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-app-text">{item.title}</p>
                                    <p className="text-xs text-app-text-secondary mt-0.5">{item.description}</p>
                                </div>
                                <span className="text-xs text-app-text-secondary flex-shrink-0">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            {item.txHash && (
                                <p className="text-xs mt-2 text-brand-accent font-mono">{item.txHash.slice(0, 12)}...</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
