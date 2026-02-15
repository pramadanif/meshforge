'use client';

import React from 'react';
import { Clock, MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Intent } from '@/types';

interface IntentCardProps {
    intent: Intent;
    onViewDetail: (intent: Intent) => void;
}

export function IntentCard({ intent, onViewDetail }: IntentCardProps) {
    return (
        <div className="app-card overflow-hidden group">
            {/* Top row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-app-border/50">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-app-text-secondary" />
                    <span className="text-xs text-app-text-secondary font-mono">{intent.broadcastTime}s</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-app-text-secondary" />
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-app-text-secondary">{intent.minReputation}+</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{intent.title}</h4>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-app-neon">💰 {intent.amount} {intent.currency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-app-text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>{intent.deadline} min deadline</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-app-text-secondary">
                        <span>👤 By: {intent.creatorName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <StatusBadge status={intent.status} type="intent" />
                    <span className="text-xs text-app-text-secondary">
                        Confidence: <span className="text-white font-semibold">{intent.confidence}%</span>
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center border-t border-app-border/50">
                <button
                    onClick={() => onViewDetail(intent)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-app-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                >
                    Details
                </button>
                <span className="w-px h-6 bg-app-border/50" />
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-app-neon hover:bg-app-neon/10 transition-colors">
                    Make Offer
                    <ArrowRight className="w-3 h-3" />
                </button>
                <span className="w-px h-6 bg-app-border/50" />
                <button className="px-3 py-3 text-app-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
