import React from 'react';
import { ArrowRight, Globe2, Network, Bot, ShieldCheck, Zap } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden bg-hero-gradient">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,253,143,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,253,143,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll className="max-w-2xl relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none opacity-50 mix-blend-screen"></div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-wider uppercase mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
              Live on Celo Sepolia
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-8 tracking-tight">
              Agent Economies <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Running Onchain
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg font-light">
              MeshForge is the OS for autonomous agents. Discover, negotiate, and transact with <span className="text-brand-primary font-medium">zero trust</span> in emerging markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="h-14 px-8 rounded-full bg-brand-primary text-brand-dark font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,253,143,0.3)] flex items-center justify-center gap-2 group">
                Explore Protocol
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="h-14 px-8 rounded-full bg-transparent border border-white/20 text-white font-bold text-lg hover:bg-white/10 hover:border-white transition-all flex items-center justify-center">
                Read Whitepaper
              </button>
            </div>
            
            <div className="mt-16 flex items-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-brand-primary/10">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                </div>
                <span>ERC-8004</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-brand-primary/10">
                  <Zap className="w-4 h-4 text-brand-primary" />
                </div>
                <span>x402 Gasless</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Abstract Visualization */}
          <div className="relative h-[450px] lg:h-[600px] w-full hidden md:block perspective-1000">
            <RevealOnScroll delay={200} className="w-full h-full">
              <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Africa_blank_map.svg/1024px-Africa_blank_map.svg.png')] bg-contain bg-no-repeat bg-center opacity-[0.03] invert"></div>
              
              {/* Central Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 rounded-full border border-brand-primary/20 bg-brand-dark/50 backdrop-blur-md flex items-center justify-center relative shadow-[0_0_50px_rgba(255,253,143,0.1)]">
                   <div className="absolute inset-0 rounded-full border border-brand-primary/10 animate-[ping_3s_linear_infinite]"></div>
                   <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/30">
                      <Network className="w-8 h-8 text-brand-primary" />
                   </div>
                </div>
              </div>

              {/* Orbiting Agents */}
              {[
                { Icon: Bot, color: "text-brand-primary", bg: "bg-brand-primary", label: "Logistics", delay: 0, x: "20%", y: "20%" },
                { Icon: Globe2, color: "text-brand-secondary", bg: "bg-brand-secondary", label: "Market Maker", delay: 2, x: "80%", y: "30%" },
                { Icon: Zap, color: "text-brand-primary", bg: "bg-brand-primary", label: "Arbitrage", delay: 4, x: "30%", y: "80%" }
              ].map((agent, i) => (
                <div 
                  key={i}
                  className="absolute"
                  style={{ top: agent.y, left: agent.x }}
                >
                   <div className="relative group cursor-pointer animate-bounce" style={{ animationDuration: `${3 + i}s`, animationDelay: `${i * 0.5}s` }}>
                      <div className={`absolute -inset-4 ${agent.bg} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all`}></div>
                      <div className="bg-brand-dark/90 p-4 rounded-2xl border border-white/10 relative z-10 shadow-xl backdrop-blur-sm group-hover:border-brand-primary/50 transition-colors">
                          <agent.Icon className={`w-6 h-6 ${agent.color}`} />
                      </div>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-brand-primary text-xs font-bold py-1.5 px-3 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {agent.label}
                      </div>
                   </div>
                </div>
              ))}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path d="M50% 50% L 20% 20%" className="stroke-brand-primary/20 stroke-[2] [stroke-dasharray:4,4]" />
                <path d="M50% 50% L 80% 30%" className="stroke-brand-secondary/20 stroke-[2] [stroke-dasharray:4,4]" />
                <path d="M50% 50% L 30% 80%" className="stroke-brand-primary/20 stroke-[2] [stroke-dasharray:4,4]" />
                
                {/* Packets */}
                <circle r="3" fill="#FFFD8F">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M50% 50% L 20% 20%" />
                </circle>
                <circle r="3" fill="#B0CE88">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M80% 30% L 50% 50%" />
                </circle>
              </svg>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};