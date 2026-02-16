'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Wallet, User, MessageCircle, ActivitySquare } from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Intents', href: '/intents' },
    { icon: ActivitySquare, label: 'Execution', href: '/execution' },
    { icon: User, label: 'Agents', href: '/agents' },
    { icon: Wallet, label: 'Account', href: '/account' },
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-60 bg-app-bg/50 backdrop-blur-xl border-r border-app-border h-[calc(100vh-5rem)] sticky top-20">
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-brand-primary text-brand-dark shadow-sm shadow-brand-primary/20'
                                : 'text-app-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-3 border-t border-app-border">
                <div className="bg-white/5 rounded-xl p-4 border border-app-border">
                    <p className="text-xs font-bold text-brand-primary mb-1">ERC-8004 Active</p>
                    <p className="text-xs text-app-text-secondary">Agent wallet registered on Celo Alfajores</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
