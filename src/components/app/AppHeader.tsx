'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function AppHeader() {
    const [showDropdown] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-20 app-glass flex items-center px-4 lg:px-8 shadow-sm transition-all duration-300">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 mr-6 group flex-shrink-0">
                <Image
                    src="/meshforge.png"
                    alt="MeshForge"
                    width={44}
                    height={44}
                    className="rounded-lg shadow-2xl shadow-brand-primary/20 ring-1 ring-brand-primary/15 transition-transform group-hover:rotate-3"
                    priority
                />
                <span className="font-display font-bold text-base text-white hidden sm:inline">
                    MeshForge<span className="text-brand-primary">.v2</span>
                </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agents, intents, transactions..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-white/10 text-app-text-secondary hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Wallet Connection */}
                <ConnectButton
                    accountStatus={{
                        smallScreen: 'avatar',
                        largeScreen: 'full',
                    }}
                />
            </div>
        </header>
    );
}
