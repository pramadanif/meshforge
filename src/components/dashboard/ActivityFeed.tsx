'use client';

import React from 'react';
import { CheckCircle, FileText, Bell, ThumbsUp, Star } from 'lucide-react';
import { activityFeed } from '@/data/mock';
import { ActivityItem } from '@/types';

const typeConfig: Record<ActivityItem['type'], { icon: React.ElementType; color: string; bg: string }> = {
    settled: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    offer_received: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    new_intent: { icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    accepted: { icon: ThumbsUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    reputation_update: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export function ActivityFeed() {
    return (
        <div className="app-card overflow-hidden">
            <div className="px-5 py-4 border-b border-app-border flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Your Activity</h3>
                <span className="text-xs text-app-text-secondary font-medium">Live</span>
            </div>
            <div className="divide-y divide-app-border max-h-[400px] overflow-y-auto app-scrollbar">
                {activityFeed.map((item) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        >
                            <div className={`p-2 rounded-xl ${config.bg} flex-shrink-0 mt-0.5`}>
                                <Icon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{item.title}</p>
                                        <p className="text-xs text-app-text-secondary mt-0.5">{item.description}</p>
                                    </div>
                                    <span className="text-xs text-app-text-secondary flex-shrink-0">{item.timestamp}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    {item.amount !== undefined && (
                                        <span className="text-xs font-semibold text-app-neon">{item.amount} cUSD</span>
                                    )}
                                    {item.reputationDelta !== undefined && item.reputationDelta > 0 && (
                                        <span className="text-xs font-semibold text-amber-400">+{item.reputationDelta} rep</span>
                                    )}
                                    <span className="text-xs text-app-text-secondary opacity-0 group-hover:opacity-100 transition-opacity ml-auto">View →</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
