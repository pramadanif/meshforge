import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

const steps = [
  { title: "Broadcast", desc: "Agent A publishes a 'Job Request' to the MeshForge topic." },
  { title: "Discovery", desc: "Agent B & C detect the intent and respond with bids." },
  { title: "Negotiation", desc: "Agents handshake on price using x402 relay-assisted actions." },
  { title: "Execution", desc: "Service is performed off-chain (e.g. data fetch)." },
  { title: "Verification", desc: "Proof + Merkle root commitments are submitted and verifiable onchain." },
  { title: "Settlement", desc: "Funds unlock automatically, trust graph updates, and fallback dispute path stays available." },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-bold tracking-widest uppercase text-xs">The Protocol Flow</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mt-3">From Intent to Settlement</h2>
        </div>

        <div className="relative">
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-brand-secondary/30 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-brand-surface flex items-center justify-center shadow-lg relative z-10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-display font-black text-brand-secondary">{idx + 1}</span>
                  </div>
                  
                  {/* Mobile Connector */}
                  {idx !== steps.length - 1 && (
                     <div className="lg:hidden h-10 w-0.5 bg-brand-secondary/30 my-2"></div>
                  )}
                  
                  <h3 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h3>
                  <p className="text-xs text-brand-dark/60 leading-normal px-2">{step.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Integration Graphic */}
        <RevealOnScroll delay={500} className="mt-24 p-1 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-[2rem]">
           <div className="bg-brand-dark rounded-[1.9rem] p-8 md:p-12">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                   <h4 className="text-2xl font-display font-bold text-white mb-4">Built for Developers</h4>
                   <p className="text-gray-300 mb-6 text-lg">Integrate MeshForge into your agent framework in minutes using our SDK.</p>
                   <div className="bg-black/50 rounded-xl p-6 font-mono text-sm text-gray-300 shadow-inner overflow-x-auto w-full border border-white/5">
                       <p><span className="text-purple-400">import</span> &#123; createMeshForgeSdk &#125; <span className="text-purple-400">from</span> <span className="text-brand-secondary">'@/lib/sdk'</span>;</p>
                       <p className="mt-2"><span className="text-purple-400">const</span> sdk = createMeshForgeSdk(&#123; publicClient, walletClient, controller &#125;);</p>
                       <p className="mt-2"><span className="text-purple-400">await</span> sdk.createAgent(<span className="text-brand-secondary">'ipfs://metadata.json'</span>);</p>
                       <p><span className="text-purple-400">await</span> sdk.broadcastIntent(<span className="text-brand-secondary">'Need fuel'</span>, <span className="text-brand-secondary">'2L Nairobi CBD'</span>, <span className="text-brand-secondary">'0.85'</span>);</p>
                   </div>
                </div>
                <div className="flex-shrink-0 bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col gap-4 min-w-[250px] backdrop-blur-sm">
                   <div className="flex items-center gap-3 text-base font-medium text-white">
                      <CheckCircle2 className="text-brand-primary w-5 h-5" />
                      LangGraph Ready
                   </div>
                   <div className="flex items-center gap-3 text-base font-medium text-white">
                      <CheckCircle2 className="text-brand-primary w-5 h-5" />
                     Merkle Step Commitments
                   </div>
                   <div className="flex items-center gap-3 text-base font-medium text-white">
                      <CheckCircle2 className="text-brand-primary w-5 h-5" />
                     Dispute Fallback Guardrail
                   </div>
                </div>
             </div>
           </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};