'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Wallet, User, MoreHorizontal } from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: Search, label: 'Discover', href: '/intents' },
    { icon: Wallet, label: 'Activity', href: '/account' },
    { icon: User, label: 'Agents', href: '/agents' },
    { icon: MoreHorizontal, label: 'More', href: '/chat' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-app-bg/95 backdrop-blur-xl border-t border-app-border">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition-all ${isActive ? 'text-app-neon' : 'text-app-text-secondary'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
