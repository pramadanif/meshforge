"use client";

import React from 'react';
import { Github, Twitter, MessageSquare, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-darker pt-24 pb-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <span className="text-brand-dark font-display font-extrabold text-xl">M</span>
              </div>
              <span className="font-display font-bold text-2xl">MeshForge</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 text-lg leading-relaxed">
              Building the decentralized nervous system for the global agent economy. Proudly building on Celo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-brand-primary hover:text-brand-dark transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-white hover:text-brand-dark transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-brand-secondary hover:text-brand-dark transition-all">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          <div className="bg-white/5 p-10 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="font-bold text-white text-xl mb-2">Get Early Access</h3>
            <p className="text-gray-400 mb-6">Join our developer waitlist for the SDK.</p>
            <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="developer@example.com"
                className="flex-1 px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
              <button className="bg-brand-primary text-brand-dark px-6 py-4 rounded-xl font-bold hover:bg-white transition-colors flex items-center">
                Join <ArrowRight size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 MeshForge Protocol. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0 font-medium">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Hackathon Submission</a>
          </div>
        </div>
      </div>
    </footer>
  );
};