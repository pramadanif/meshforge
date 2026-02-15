'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, MessageCircle, ArrowRight, CheckCircle, Clock, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { agents, activityChartData } from '@/data/mock';
import { Endorsement, Testimonial } from '@/types';

export default function AgentProfilePage() {
    const { agentId } = useParams<{ agentId: string }>();
    const agent = agents.find((a) => a.id === agentId);

    if (!agent) {
        return (
            <div className="p-6 text-center">
                <p className="text-app-text-secondary">Agent not found</p>
                <Link href="/agents" className="text-app-neon text-sm mt-2 inline-block">← Back to directory</Link>
            </div>
        );
    }

    const reputationBreakdown = [
        { label: 'Economic Volume', value: 87, color: 'bg-app-neon' },
        { label: 'Success Rate', value: Math.round(agent.successRate), color: 'bg-blue-400' },
        { label: 'Recency', value: 72, color: 'bg-amber-400' },
        { label: 'Human Attestation', value: 64, color: 'bg-purple-400' },
    ];

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            {/* Back */}
            <Link href="/agents" className="inline-flex items-center gap-2 text-sm text-app-text-secondary hover:text-white transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to directory
            </Link>

            {/* Header */}
            <div className="app-card p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-app-neon to-app-purple flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                            {agent.name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-app-card ${agent.status === 'online' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-amber-400' : 'bg-gray-400'
                            }`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-xl font-display font-bold text-white">{agent.name}</h1>
                            <StatusBadge status={agent.status} type="agent" />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-app-text-secondary mb-2">
                            <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {agent.reputation}/5.0
                            </span>
                            <span>|</span>
                            <span>{agent.completedIntents} completed</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-app-text-secondary mb-3">
                            <MapPin className="w-3.5 h-3.5" /> {agent.location}
                        </div>
                        {agent.bio && <p className="text-sm text-app-text-secondary">{agent.bio}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button className="px-4 py-2 bg-white/5 border border-app-border text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors">
                            ❤️ Favorite
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-app-border text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Chat
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-app-neon text-app-bg text-sm font-bold rounded-xl hover:bg-white transition-colors">
                            Make Offer <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: CheckCircle, label: 'Completed', value: `${agent.completedIntents} intents`, color: 'text-app-neon' },
                    { icon: TrendingUp, label: 'Success Rate', value: `${agent.successRate}%`, color: 'text-blue-400' },
                    { icon: DollarSign, label: 'Total Volume', value: `$${agent.totalVolume.toLocaleString()}`, color: 'text-amber-400' },
                    { icon: Clock, label: 'Avg Response', value: `${agent.avgResponseTime} seconds`, color: 'text-purple-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="app-card p-4 text-center">
                        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                        <p className="text-lg font-bold text-white">{value}</p>
                        <p className="text-xs text-app-text-secondary">{label}</p>
                    </div>
                ))}
            </div>

            {/* Reputation Breakdown */}
            <div className="app-card p-5 mb-6">
                <h3 className="text-sm font-bold text-white mb-4">Reputation Breakdown</h3>
                <div className="space-y-3">
                    {reputationBreakdown.map(({ label, value, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-app-text-secondary">{label}</span>
                                <span className="text-white font-medium">{value}/100</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2">
                                <div className={`${color} rounded-full h-2 transition-all duration-500`} style={{ width: `${value}%` }} />
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-app-border/50">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-app-text-secondary">Composite</span>
                            <span className="text-lg font-bold text-app-neon">⭐ {agent.reputation}/5.0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart placeholder */}
            <div className="app-card p-5 mb-6">
                <h3 className="text-sm font-bold text-white mb-4">Activity (Last 7 Days)</h3>
                <div className="flex items-end gap-2 h-32">
                    {activityChartData.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full bg-app-neon/20 rounded-t-md hover:bg-app-neon/40 transition-colors relative group"
                                style={{ height: `${(d.intents / 12) * 100}%`, minHeight: '4px' }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-app-card border border-app-border text-xs text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {d.intents}
                                </div>
                            </div>
                            <span className="text-[10px] text-app-text-secondary">{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills & Endorsements */}
            {agent.endorsements && agent.endorsements.length > 0 && (
                <div className="app-card p-5 mb-6">
                    <h3 className="text-sm font-bold text-white mb-4">Skills & Endorsements</h3>
                    <div className="space-y-2">
                        {agent.endorsements.map(({ skill, count }: Endorsement) => (
                            <div key={skill} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-app-border/50">
                                <span className="text-sm text-app-neon font-medium">{skill}</span>
                                <span className="text-xs text-app-text-secondary">endorsed by <span className="text-white font-medium">{count}</span> agents</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Testimonials */}
            {agent.testimonials && agent.testimonials.length > 0 && (
                <div className="app-card p-5 mb-6">
                    <h3 className="text-sm font-bold text-white mb-4">Testimonials</h3>
                    <div className="space-y-3">
                        {agent.testimonials.map(({ agentName, text, date }: Testimonial, i: number) => (
                            <div key={i} className="bg-white/[0.03] rounded-xl px-4 py-3 border border-app-border/50">
                                <p className="text-sm text-app-text italic">&ldquo;{text}&rdquo;</p>
                                <p className="text-xs text-app-text-secondary mt-2">— @{agentName} · {date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Wallet info */}
            <div className="app-card p-5">
                <h3 className="text-sm font-bold text-white mb-3">Onchain Identity</h3>
                <div className="flex items-center gap-3">
                    <code className="text-xs text-app-text-secondary font-mono bg-black/20 px-2 py-1 rounded">{agent.walletAddress}</code>
                    <a href="https://www.8004scan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs">
                        8004scan <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}
