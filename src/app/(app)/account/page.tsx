'use client';

import React, { useState } from 'react';
import { Wallet, Star, CheckCircle, Flame, Copy, ExternalLink, Edit, Save } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { currentUser, currentUserReputation, transactions, intents } from '@/data/mock';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'intents' | 'transactions' | 'settings'>('overview');

    const tabs = [
        { id: 'overview' as const, label: 'Overview' },
        { id: 'intents' as const, label: 'Intents' },
        { id: 'transactions' as const, label: 'Transactions' },
        { id: 'settings' as const, label: 'Settings' },
    ];

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-white mb-6">My Account</h1>

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
                    {/* Wallet Card */}
                    <div className="app-card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-app-neon/10">
                                    <Wallet className="w-5 h-5 text-app-neon" />
                                </div>
                                <div>
                                    <p className="text-xs text-app-text-secondary font-medium">Connected Wallet</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="text-sm text-white font-mono">{currentUser.walletAddress}</code>
                                        <button className="text-app-text-secondary hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            </div>
                            <a href="https://docs.celo.org/build-on-celo/build-with-ai/overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs">
                                Celo Docs <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-4 border border-app-border/50">
                            <p className="text-xs text-app-text-secondary mb-1">Balance</p>
                            <p className="text-2xl font-bold text-app-neon">{currentUser.balanceCUSD} cUSD</p>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="app-card p-4 text-center">
                            <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">⭐ {currentUser.reputation}</p>
                            <p className="text-xs text-app-text-secondary">Reputation</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <CheckCircle className="w-5 h-5 text-app-neon mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">{currentUser.completedIntents}</p>
                            <p className="text-xs text-app-text-secondary">Completed</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">${currentUser.totalVolume.toLocaleString()}</p>
                            <p className="text-xs text-app-text-secondary">Total Volume</p>
                        </div>
                        <div className="app-card p-4 text-center">
                            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">🔥 {currentUser.activityStreak} days</p>
                            <p className="text-xs text-app-text-secondary">Activity Streak</p>
                        </div>
                    </div>

                    {/* Reputation Breakdown */}
                    <div className="app-card p-5">
                        <h3 className="text-sm font-bold text-white mb-4">Reputation Details</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Economic Volume', value: currentUserReputation.economicVolume, extra: `$${currentUser.totalVolume.toLocaleString()} (↗ +$340 this week)` },
                                { label: 'Success Rate', value: currentUserReputation.successRate, extra: `${currentUser.successRate}% (streak: ${currentUser.activityStreak} days)` },
                                { label: 'Recency', value: currentUserReputation.recency, extra: `Last active ${currentUser.lastActive}` },
                                { label: 'Human Attestation', value: currentUserReputation.humanAttestation, extra: `${currentUser.endorsements?.reduce((a: number, e: { count: number }) => a + e.count, 0) || 0} endorsements` },
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
                    {intents.filter(i => i.creatorId === 'agent-self').map((intent) => (
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
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-app-text-secondary">Showing {transactions.length} transactions</p>
                        <button className="text-xs text-app-neon hover:text-white transition-colors">Export CSV</button>
                    </div>
                    {transactions.map((tx) => (
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
                                        {tx.type === 'sent' ? '-' : '+'}{tx.amount} cUSD
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
                                <select className="bg-white/5 border border-app-border rounded-lg px-3 py-1.5 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
                                    <option>English</option>
                                    <option>Swahili</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-app-text-secondary">Theme</span>
                                <select className="bg-white/5 border border-app-border rounded-lg px-3 py-1.5 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
                                    <option>Dark</option>
                                    <option>Light</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-app-text-secondary">Currency display</span>
                                <select className="bg-white/5 border border-app-border rounded-lg px-3 py-1.5 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
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
