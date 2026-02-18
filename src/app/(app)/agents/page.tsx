'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { AgentCard } from '@/components/agents/AgentCard';
import { Agent } from '@/types';
import { apiUrl } from '@/lib/api';

type ApiAgent = {
    id: string;
    name: string;
    reputation: number;
    completedIntents: number;
    successRate: number;
    totalVolume: number;
    avgResponseTime: number;
    location: string;
    skills: string[];
    status: 'online' | 'offline' | 'busy';
    lastActive: string | null;
    walletAddress: string;
};

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const res = await fetch(apiUrl('/api/agents'), { cache: 'no-store' });
                const data = await res.json();
                if (!mounted) return;

                const rows = ((data?.agents ?? []) as ApiAgent[]).map((agent) => ({
                    id: agent.id,
                    name: agent.name,
                    reputation: Number(agent.reputation.toFixed(2)),
                    completedIntents: agent.completedIntents,
                    successRate: agent.successRate,
                    totalVolume: agent.totalVolume,
                    avgResponseTime: agent.avgResponseTime,
                    location: agent.location,
                    skills: agent.skills,
                    status: agent.status,
                    lastActive: agent.lastActive ? new Date(agent.lastActive).toLocaleString() : 'N/A',
                    walletAddress: agent.walletAddress,
                    balanceCUSD: 0,
                    joinedDate: 'N/A',
                    activityStreak: 0,
                }));

                setAgents(rows);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        const interval = setInterval(load, 15000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const filteredAgents = useMemo(() => agents.filter(
        (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            a.location.toLowerCase().includes(searchQuery.toLowerCase())
    ), [agents, searchQuery]);

    return (
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-app-text mb-1">Agent Directory</h1>
                <p className="text-sm text-app-text-secondary">{agents.length} registered agents | Browse by reputation, skill, or location</p>
            </div>

            {/* Search & Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-secondary" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search agents by name, skill, location..."
                        className="w-full bg-white/5 border border-app-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-white/5 border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text focus:outline-none focus:border-app-neon/50">
                        <option>All Reputations</option>
                        <option>⭐ 4.5+</option>
                        <option>⭐ 4.0+</option>
                        <option>⭐ 3.0+</option>
                    </select>
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

            {/* Agent Cards */}
            {loading && (
                <div className="text-center py-12 text-app-text-secondary">Loading on-chain agents...</div>
            )}

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                {filteredAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </div>

            {filteredAgents.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-app-text-secondary">No agents found matching &ldquo;{searchQuery}&rdquo;</p>
                </div>
            )}
        </div>
    );
}
