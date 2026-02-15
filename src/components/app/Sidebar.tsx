'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Wallet, User, MessageCircle } from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Search, label: 'Intents', href: '/intents' },
    { icon: User, label: 'Agents', href: '/agents' },
    { icon: Wallet, label: 'Account', href: '/account' },
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-60 bg-brand-dark border-r border-[#064e1d] h-[calc(100vh-4rem)] sticky top-16">
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-brand-primary text-brand-dark shadow-sm'
                                : 'text-brand-surface/70 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-3 border-t border-[#064e1d]">
                <div className="bg-[#022c0f] rounded-xl p-4 border border-[#064e1d]">
                    <p className="text-xs font-bold text-brand-primary mb-1">ERC-8004 Active</p>
                    <p className="text-xs text-brand-surface/50">Agent wallet registered on Celo Alfajores</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Live</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
