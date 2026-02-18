'use client';

import React, { useState } from 'react';
import { Plus, Grid3X3, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { useIntents } from '@/hooks/useMeshForge';
import { IntentCard } from '@/components/intents/IntentCard';
import { IntentDetailModal } from '@/components/intents/IntentDetailModal';
import { CreateIntentModal } from '@/components/intents/CreateIntentModal';
import { AGENT_FACTORY_ABI, AGENT_FACTORY_ADDRESS } from '@/lib/contracts';
import { Intent } from '@/types';

export default function IntentsPage() {
    const { intents: allIntents, isLoading } = useIntents();
    const { address } = useAccount();
    const { data: controllerWallet } = useReadContract({
        address: AGENT_FACTORY_ADDRESS,
        abi: AGENT_FACTORY_ABI,
        functionName: 'controllerToWallet',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const myAgentWallet = controllerWallet && controllerWallet !== '0x0000000000000000000000000000000000000000'
        ? controllerWallet.toLowerCase()
        : null;
    const [tab, setTab] = useState<'discover' | 'my' | 'offers'>('discover');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const tabs = [
        { id: 'discover' as const, label: 'Discover' },
        { id: 'my' as const, label: 'My Intents' },
        { id: 'offers' as const, label: 'Offers Received' },
    ];

    const filteredIntents = (allIntents as Intent[]).filter((i) => {
        if (tab === 'my') return !!myAgentWallet && i.creatorId.toLowerCase() === myAgentWallet;
        if (tab === 'offers') return i.offers.length > 0;
        return true;
    });

    const openCount = (allIntents as Intent[]).filter((i) => i.status === 'open').length;

    return (
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-app-text">Intent Marketplace</h1>
                        <p className="text-sm text-app-text-secondary mt-1">
                            {openCount} open intents | $12K escrow locked | Real-time discovery
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-app-neon text-app-bg font-bold text-sm rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-app-neon/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Intent
                    </button>
                </div>

                {/* Tabs + Controls */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-1 bg-white border border-app-border rounded-xl p-1">
                        {tabs.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id
                                    ? 'bg-app-neon text-app-bg'
                                    : 'text-app-text-secondary hover:text-app-text'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-app-neon/10 text-app-neon' : 'text-app-text-secondary hover:text-app-text hover:bg-white/10'}`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                        <div className="flex bg-white border border-app-border rounded-xl p-0.5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-surface text-brand-dark' : 'text-app-text-secondary'}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-surface text-brand-dark' : 'text-app-text-secondary'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="app-card p-4 mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">Category</label>
                        <select className="w-full bg-white/5 border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
                            <option value="">All</option>
                            <option>Delivery</option>
                            <option>Finance</option>
                            <option>Commerce</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">Price Range</label>
                        <input type="range" min="0" max="100" className="w-full accent-app-neon" />
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">Location</label>
                        <input placeholder="Any location" className="w-full bg-white/5 border border-app-border rounded-lg px-3 py-2 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50" />
                    </div>
                    <div>
                        <label className="text-xs text-app-text-secondary font-medium mb-2 block">Time Sensitivity</label>
                        <select className="w-full bg-white/5 border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
                            <option value="">Any</option>
                            <option>Urgent (&lt;30 min)</option>
                            <option>Normal (&lt;2 hours)</option>
                            <option>Flexible (&gt;2 hours)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Intent Cards */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-app-neon animate-spin" />
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                    {filteredIntents.map((intent) => (
                        <IntentCard key={intent.id} intent={intent} onViewDetail={setSelectedIntent} />
                    ))}
                </div>
            )}

            {filteredIntents.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-app-text-secondary">No intents found</p>
                </div>
            )}

            {/* Modals */}
            <IntentDetailModal intent={selectedIntent} onClose={() => setSelectedIntent(null)} />
            <CreateIntentModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
        </div>
    );
}
