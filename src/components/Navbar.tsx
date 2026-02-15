"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-dark py-2' : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-transform group-hover:rotate-3">
              <span className="text-brand-dark font-display font-extrabold text-2xl">M</span>
            </div>
            <span className={`font-display font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-white' : 'text-white'}`}>
              MeshForge
              <span className="text-brand-primary">.v2</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How it Works', 'Demo'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-300 hover:text-brand-primary transition-colors text-sm font-medium tracking-wide"
              >
                {item}
              </a>
            ))}
            <Link href="/dashboard" className="bg-brand-primary text-brand-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all flex items-center gap-2">
              Launch App
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-brand-primary transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-dark border-t border-white/10 shadow-2xl px-4 py-6 flex flex-col space-y-4">
          {['Features', 'How it Works', 'Demo'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-brand-primary font-medium text-lg py-2 border-b border-white/5"
            >
              {item}
            </a>
          ))}
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="bg-brand-primary text-brand-dark w-full py-4 rounded-xl font-bold mt-4 text-center block">
            Launch App
          </Link>
        </div>
      )}
    </nav>
  );
};