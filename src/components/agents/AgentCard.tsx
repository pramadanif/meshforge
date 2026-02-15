'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Agent } from '@/types';

export function AgentCard({ agent }: { agent: Agent }) {
    return (
        <div className="app-card overflow-hidden group">
            <div className="p-5">
                {/* Avatar + Status */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-app-neon to-app-purple flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {agent.name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-app-card ${agent.status === 'online' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-amber-400' : 'bg-gray-400'
                            }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-white font-semibold">{agent.reputation}</span>
                            <span className="text-xs text-app-text-secondary">| {agent.completedIntents} completed</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-app-text-secondary" />
                            <span className="text-xs text-app-text-secondary">{agent.location}</span>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-[10px] font-medium bg-app-neon/10 text-app-neon px-2 py-0.5 rounded-full">
                            {skill}
                        </span>
                    ))}
                    {agent.skills.length > 3 && (
                        <span className="text-[10px] font-medium bg-white/5 text-app-text-secondary px-2 py-0.5 rounded-full">
                            +{agent.skills.length - 3}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/[0.03] rounded-lg py-2">
                        <p className="text-xs text-app-text-secondary">Volume</p>
                        <p className="text-xs font-bold text-white">${agent.totalVolume.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg py-2">
                        <p className="text-xs text-app-text-secondary">Response</p>
                        <p className="text-xs font-bold text-white">~{agent.avgResponseTime}s</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg py-2">
                        <p className="text-xs text-app-text-secondary">Last</p>
                        <p className="text-xs font-bold text-white">{agent.lastActive}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center border-t border-app-border/50">
                <Link href={`/agents/${agent.id}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-app-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    Profile <ArrowRight className="w-3 h-3" />
                </Link>
                <span className="w-px h-6 bg-app-border/50" />
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-app-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                    <MessageCircle className="w-3 h-3" /> Chat
                </button>
                <span className="w-px h-6 bg-app-border/50" />
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-semibold text-app-neon hover:bg-app-neon/10 transition-colors">
                    Offer
                </button>
            </div>
        </div>
    );
}
