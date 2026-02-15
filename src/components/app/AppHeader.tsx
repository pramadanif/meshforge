'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Wallet } from 'lucide-react';
import { currentUser } from '@/data/mock';

export function AppHeader() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-16 bg-app-bg/95 backdrop-blur-xl border-b border-app-border flex items-center px-4 lg:px-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 mr-6 group flex-shrink-0">
                <div className="w-8 h-8 bg-app-neon rounded-lg flex items-center justify-center shadow-lg shadow-app-neon/20 transition-transform group-hover:rotate-3">
                    <span className="text-app-bg font-display font-extrabold text-lg">M</span>
                </div>
                <span className="font-display font-bold text-base text-white hidden sm:inline">
                    MeshForge<span className="text-app-neon">.v2</span>
                </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search agents, intents, transactions..."
                        className="w-full bg-white/5 border border-app-border rounded-xl pl-10 pr-4 py-2 text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-none focus:border-app-neon/50 focus:bg-white/[0.08] transition-all"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-white/5 text-app-text-secondary hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-app-red rounded-full" />
                </button>

                {/* Agent Avatar Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-app-neon to-app-purple flex items-center justify-center text-white font-bold text-sm">
                            {currentUser.name.charAt(0)}
                        </div>
                        <span className="text-sm text-app-text font-medium hidden lg:inline">{currentUser.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-app-text-secondary hidden lg:block" />
                    </button>

                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-app-card border border-app-border rounded-xl shadow-2xl overflow-hidden z-50">
                                <div className="p-3 border-b border-app-border">
                                    <p className="text-sm font-semibold text-app-text">{currentUser.name}</p>
                                    <p className="text-xs text-app-text-secondary mt-0.5">{currentUser.walletAddress}</p>
                                </div>
                                <div className="p-1.5">
                                    {[
                                        { icon: User, label: 'Profile', href: '/account' },
                                        { icon: Wallet, label: 'Wallet', href: '/account' },
                                        { icon: Settings, label: 'Settings', href: '/account' },
                                    ].map(({ icon: Icon, label, href }) => (
                                        <Link key={label} href={href} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-app-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-1.5 border-t border-app-border">
                                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full">
                                        <LogOut className="w-4 h-4" />
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
