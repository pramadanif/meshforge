'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { currentUser } from '@/data/mock';

export function AppHeader() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 flex items-center px-4 lg:px-8 shadow-sm transition-all duration-300">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 mr-6 group flex-shrink-0">
                <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center shadow-lg shadow-brand-dark/20 transition-transform group-hover:rotate-3">
                    <span className="text-brand-primary font-display font-extrabold text-lg">M</span>
                </div>
                <span className="font-display font-bold text-base text-brand-dark hidden sm:inline">
                    MeshForge<span className="text-brand-accent">.v2</span>
                </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agents, intents, transactions..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-brand-dark transition-colors">
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
