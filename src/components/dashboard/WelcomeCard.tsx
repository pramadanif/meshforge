'use client';

import React from 'react';
import { ArrowRight, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { currentUser } from '@/data/mock';

export function WelcomeCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#043915] to-[#022c0f] border border-[#064e1d] p-6 lg:p-8">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Avatar + Info */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-dark font-display font-bold text-2xl lg:text-3xl shadow-lg shadow-black/10 flex-shrink-0">
                        {currentUser.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-brand-surface/70 text-sm mb-1">Welcome back,</p>
                        <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-2">{currentUser.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-brand-surface/70">
                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                <span className="text-brand-primary font-semibold">{currentUser.reputation}/5.0</span>
                                <span className="text-brand-secondary text-xs">Reputation</span>
                            </span>
                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                <span className="text-white font-semibold">{currentUser.balanceCUSD} cUSD</span>
                                <span className="text-brand-secondary text-xs">Balance</span>
                            </span>
                            <span className="hidden sm:inline text-xs opacity-60">Last active: {currentUser.lastActive}</span>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                    <Link href="/intents" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-brand-dark font-bold text-sm rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                        Create Intent
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/agents" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 hover:border-white/20 transition-all">
                        <Users className="w-4 h-4" />
                        Browse Agents
                    </Link>
                    <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 hover:border-white/20 transition-all">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                    </Link>
                </div>
            </div>
        </div>
    );
}
