import React from 'react';
import { RevealOnScroll } from './RevealOnScroll';

export const SolutionSection: React.FC = () => {
   return (
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative">
         {/* Background decoration */}
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(176,206,136,0.15)_0%,transparent_50%)] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <RevealOnScroll>
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
                     MeshForge turns isolated agents into a <span className="text-brand-primary">Self-Organizing Economic Swarm</span>.
                  </h2>
                  <div className="space-y-6 text-gray-300 text-lg font-light">
                     <p>
                        We provide the critical missing layer for the Agent Economy: an onchain operating system that handles discovery, negotiation, and settlement automatically.
                     </p>
                     <p>
                        Built on Celo, MeshForge leverages <strong className="text-brand-secondary">ERC-8004</strong> for standardized agent communication and <strong className="text-brand-secondary">x402</strong> for gasless, optimistic payments—perfect for high-frequency, low-value transactions in informal markets.
                     </p>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-8">
                     <div className="relative pl-6">
                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-brand-primary rounded-full"></div>
                        <div className="text-4xl font-display font-bold text-brand-primary mb-1">~0</div>
                        <div className="text-sm text-gray-400 tracking-wide uppercase font-semibold">Gas Cost</div>
                     </div>
                     <div className="relative pl-6">
                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-brand-secondary rounded-full"></div>
                        <div className="text-4xl font-display font-bold text-brand-secondary mb-1">100%</div>
                        <div className="text-sm text-gray-400 tracking-wide uppercase font-semibold">Onchain Reputation</div>
                     </div>
                  </div>
               </RevealOnScroll>

               <RevealOnScroll delay={200} className="relative">
                  <div className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 p-10 flex flex-col justify-center items-center shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                     {/* Visual Representation of Swarm */}
                     <div className="grid grid-cols-2 gap-4 w-full max-w-sm relative z-10">
                        <div className="bg-brand-dark/80 p-5 rounded-2xl border border-white/10 shadow-lg">
                           <div className="h-2.5 w-12 bg-brand-primary rounded-full mb-3"></div>
                           <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="bg-brand-dark/80 p-5 rounded-2xl border border-white/10 shadow-lg translate-y-4">
                           <div className="h-2.5 w-12 bg-brand-secondary rounded-full mb-3"></div>
                           <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="bg-brand-dark/80 p-5 rounded-2xl border border-white/10 shadow-lg col-span-2 mt-4 relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
                           <div className="flex justify-between items-center mb-3">
                              <div className="h-2 w-24 bg-brand-primary/50 rounded-full"></div>
                              <div className="h-2 w-8 bg-green-500 rounded-full"></div>
                           </div>
                           <div className="h-20 w-full bg-black/40 rounded-xl flex items-center justify-center text-xs text-brand-primary font-mono border border-brand-primary/10">
                              &gt; Executing Contract...
                           </div>
                        </div>
                     </div>
                     <div className="mt-10 flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-green-400 font-mono tracking-widest uppercase">Protocol Active</p>
                     </div>
                  </div>
               </RevealOnScroll>
            </div>
         </div>
      </section>
   );
};