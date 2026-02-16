'use client';

import React, { useState } from 'react';
import { Search, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { agents } from '@/data/mock';
import { AgentCard } from '@/components/agents/AgentCard';

export default function AgentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredAgents = agents.filter(
        (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            a.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-display font-bold text-brand-dark mb-1">Agent Directory</h1>
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
