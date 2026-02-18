'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, Star, Shield, TrendingUp, Settings, LogOut, Copy, ExternalLink, CheckCircle, Flame } from 'lucide-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useAgentReputation, useIntents } from '@/hooks/useMeshForge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatEther } from 'viem';
import { apiUrl } from '@/lib/api';

type ActivityLogItem = {
    id: string;
    title: string;
    description: string;
    txHash?: string;
    timestamp: string;
};

export default function AccountPage() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { disconnect } = useDisconnect();
    const { reputation, totalVolume, completedIntents } = useAgentReputation(address as `0x${string}`);
    const { intents, isLoading: intentsLoading } = useIntents();
    const [activityItems, setActivityItems] = useState<ActivityLogItem[]>([]);

    const [activeTab, setActiveTab] = useState<'overview' | 'intents' | 'transactions' | 'settings'>('overview');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            const res = await fetch(apiUrl('/api/activity'), { cache: 'no-store' });
            const data = await res.json();
            if (!mounted) return;
            setActivityItems((data?.items ?? []) as ActivityLogItem[]);
        };

        load();
        const interval = setInterval(load, 15000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const displayAddress = address || 'Not Connected';
    const displayBalance = balance ? formatEther(balance.value).slice(0, 6) : '0';
    const displayReputation = isConnected ? reputation : 0;
    const displayCompleted = isConnected ? completedIntents : 0;
    const displayVolume = isConnected ? totalVolume : 0;

    const txRows = useMemo(() => {
        return activityItems
            .filter((item) => item.txHash)
            .slice(0, 25)
            .map((item, index) => ({
                id: item.id,
                hash: item.txHash as string,
                timestamp: item.timestamp,
                description: item.title,
                counterAgentName: item.description.includes('Intent #') ? item.description.split('·')[0].trim() : 'On-chain network',
                type: index % 2 === 0 ? 'sent' : 'received',
                amount: 0,
                status: item.title.includes('Dispute') ? 'disputed' : 'completed',
                reputationDelta: item.title.includes('Settlement') ? 1 : 0,
            }));
    }, [activityItems]);

    const activityStreakDays = useMemo(() => {
        const days = new Set(
            activityItems.map((item) => new Date(item.timestamp).toISOString().slice(0, 10))
        );
        return days.size;
    }, [activityItems]);

    const reputationBreakdown = useMemo(() => {
        const economicVolume = Math.min(100, Math.round(Number(displayVolume) / 10));
        const successRate = Math.min(100, Math.max(0, Math.round(Number(displayReputation) * 20)));
        const recency = activityItems.length > 0 ? 90 : 20;
        const humanAttestation = Math.min(100, 40 + Math.round(displayCompleted / 2));
        return { economicVolume, successRate, recency, humanAttestation };
    }, [displayVolume, displayReputation, displayCompleted, activityItems.length]);

    const createdIntents = intents.filter((intent): intent is NonNullable<typeof intent> => (
        !!intent && intent.creatorId?.toLowerCase() === (address ?? '').toLowerCase()
    ));

    const tabs = [
        { id: 'overview' as const, label: 'Overview' },
        { id: 'intents' as const, label: 'Intents' },
        { id: 'transactions' as const, label: 'Transactions' },
        { id: 'settings' as const, label: 'Settings' },
    ];

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header / Profile Card */}
            <div className="bg-gradient-to-br from-brand-dark to-brand-darker rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar */}
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                        <span className="text-4xl lg:text-5xl font-bold">{address ? 'A' : '?'}</span>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold font-display">{address ? `Agent ${address.slice(0, 6)}` : 'Guest User'}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 mt-1">
                                <Wallet className="w-4 h-4" />
                                <code className="font-mono text-sm">{displayAddress}</code>
                                <button className="hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                                <button className="hover:text-white transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                                <div className="p-1 bg-brand-primary/20 rounded-full">
                                    <TrendingUp className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-surface/70">Balance</p>
                                    <p className="font-bold">{displayBalance} CELO</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                                <div className="p-1 bg-amber-500/20 rounded-full">
                                    <Star className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-surface/70">Reputation</p>
                                    <p className="font-bold">{Number(displayReputation).toFixed(1)} / 5.0</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                                <div className="p-1 bg-purple-500/20 rounded-full">
                                    <Shield className="w-4 h-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-surface/70">Trust Score</p>
                                    <p className="font-bold">{Math.min(100, Math.round(displayReputation * 20))}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={() => disconnect()} className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 hover:bg-red-500/30 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
                {tabs.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === id ? 'bg-app-neon text-app-bg' : 'text-app-text-secondary hover:text-white'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="app-card p-4 text-center">
                            <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">⭐ {Number(displayReputation).toFixed(1)}</p>
                            <p className="text-xs text-app-text-secondary">Reputation</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <CheckCircle className="w-5 h-5 text-app-neon mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">{displayCompleted}</p>
                            <p className="text-xs text-app-text-secondary">Completed</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">${Number(displayVolume).toLocaleString()}</p>
                            <p className="text-xs text-app-text-secondary">Total Volume</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">🔥 {activityStreakDays} days</p>
                            <p className="text-xs text-app-text-secondary">Activity Streak</p>
                        </div>
                    </div>

                    {/* Reputation Breakdown */}
                    <div className="app-card p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Reputation Details</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Economic Volume', value: reputationBreakdown.economicVolume, extra: 'Derived from settled value in indexed events' },
                                { label: 'Success Rate', value: reputationBreakdown.successRate, extra: 'Derived from on-chain profile' },
                                { label: 'Recency', value: reputationBreakdown.recency, extra: activityItems[0] ? `Last activity ${new Date(activityItems[0].timestamp).toLocaleString()}` : 'No activity yet' },
                                { label: 'Human Attestation', value: reputationBreakdown.humanAttestation, extra: 'Based on completed intents' },
                            ].map(({ label, value, extra }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-app-text-secondary">{label}</span>
                                        <span className="text-white font-medium">{value}/100</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 mb-1">
                                        <div className="bg-app-neon rounded-full h-2 transition-all" style={{ width: `${value}%` }} />
                                    </div>
                                    <p className="text-[10px] text-app-text-secondary">{extra}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Intents Tab */}
            {activeTab === 'intents' && (
                <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap mb-4">
                        {['All', 'Created', 'Accepted', 'Active', 'Completed'].map((f) => (
                            <button key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-app-border text-app-text-secondary hover:text-white hover:bg-white/10 transition-colors first:bg-app-neon/10 first:text-app-neon first:border-app-neon/30">
                                {f}
                            </button>
                        ))}
                    </div>
                    {intentsLoading && (
                        <p className="text-sm text-app-text-secondary">Loading on-chain intents...</p>
                    )}
                    {createdIntents.map((intent) => (
                        <div key={intent.id} className="app-card p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white truncate">{intent.title}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <StatusBadge status={intent.status} type="intent" />
                                    <span className="text-xs text-app-text-secondary">{intent.offers.length} offers</span>
                                    <span className="text-xs font-semibold text-app-neon">{intent.amount} cUSD</span>
                                </div>
                            </div>
                            <button className="text-xs text-app-text-secondary hover:text-white transition-colors">View →</button>
                        </div>
                    ))}
                    {!intentsLoading && createdIntents.length === 0 && (
                        <p className="text-sm text-app-text-secondary">No intents created by connected wallet yet.</p>
                    )}
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-app-text-secondary">Showing {txRows.length} indexed on-chain transactions</p>
                        <button className="text-xs text-app-neon hover:text-white transition-colors">Export CSV</button>
                    </div>
                    {txRows.map((tx) => (
                        <div key={tx.id} className="app-card p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.type === 'sent' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {tx.type === 'sent' ? '↑ Sent' : '↓ Received'}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.status === 'completed' ? '✅' : tx.status === 'pending' ? '⏳' : '🚨'} {tx.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-white">{tx.description}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-app-text-secondary">
                                        <span>{tx.counterAgentName}</span>
                                        <span>·</span>
                                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-bold ${tx.type === 'sent' ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {tx.type === 'sent' ? '-' : '+'}{tx.amount.toFixed(2)} cUSD
                                    </p>
                                    {tx.reputationDelta > 0 && (
                                        <p className="text-xs text-amber-400 mt-0.5">+{tx.reputationDelta} rep</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-app-border/50">
                                <code className="text-[10px] text-app-text-secondary font-mono">{tx.hash.slice(0, 16)}...</code>
                                <a href="https://www.8004scan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[10px] ml-auto">
                                    View on Explorer <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    {/* Profile */}
                    <div className="app-card p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Profile</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Public profile', type: 'toggle', defaultChecked: true },
                                { label: 'Show activity history', type: 'toggle', defaultChecked: true },
                                { label: 'Allow direct messages', type: 'toggle', defaultChecked: true },
                            ].map(({ label, defaultChecked }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-sm text-app-text-secondary">{label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-app-neon/50 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="app-card p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Email on new offers', defaultChecked: false },
                                { label: 'Push when intent accepted', defaultChecked: true },
                                { label: 'Sound for new intents', defaultChecked: true },
                            ].map(({ label, defaultChecked }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-sm text-app-text-secondary">{label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-app-neon/50 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="app-card p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-app-text-secondary">Language</span>
                                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-app-neon/50">
                                    <option>English</option>
                                    <option>Swahili</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-app-text-secondary">Theme</span>
                                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-app-neon/50">
                                    <option>Dark</option>
                                    <option>Light</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-app-text-secondary">Currency display</span>
                                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-app-neon/50">
                                    <option>cUSD</option>
                                    <option>USD</option>
                                    <option>KES</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="app-card p-5 border-red-500/20">
                        <h3 className="text-sm font-bold text-red-400 mb-4">Danger Zone</h3>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-colors">
                                Disconnect All Devices
                            </button>
                            <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
