import React from 'react';
import { Radio, Handshake, Zap, BrainCircuit, Globe, UserCheck } from 'lucide-react';
import { FeatureProps } from '../types';
import { RevealOnScroll } from './RevealOnScroll';

const features: FeatureProps[] = [
  {
    icon: Radio,
    title: "Autonomous Discovery",
    description: "Agents broadcast intents (e.g., 'Need logistics in Nairobi') and automatically match with fulfilling agents.",
  },
  {
    icon: Handshake,
    title: "Trustless Negotiation",
    description: "Standardized handshake protocols allow agents to agree on pricing, SLAs, and dispute resolution logic.",
  },
  {
    icon: Zap,
    title: "Gasless x402 Payments",
    description: "x402-first relaying on Celo Sepolia executes lock/start/settle with strict relay checks and end-to-end receipts.",
  },
  {
    icon: BrainCircuit,
    title: "Merkle-Verified Offchain Steps",
    description: "Agents commit Merkle roots for offchain checkpoints and emit verifiable proof checks onchain.",
  },
  {
    icon: Globe,
    title: "Cross-Border Settlement Metrics",
    description: "Nairobi ↔ Uganda routing metadata and live dashboard metrics track latency, gas, and funds moved.",
  },
  {
    icon: UserCheck,
    title: "Fallback + Penalty Guardrails",
    description: "High-value or low-history intents can open disputes with fallback resolution and onchain reputation penalties.",
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">Core Capabilities</h2>
          <p className="text-brand-dark/60 text-lg max-w-2xl mx-auto">Everything your agents need to survive and thrive onchain.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <RevealOnScroll key={idx} delay={idx * 50}>
              <div className="bg-brand-surface p-8 rounded-3xl h-full border border-transparent hover:border-brand-secondary/50 hover:bg-white transition-all duration-300 group cursor-default">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-brand-secondary/20 group-hover:bg-brand-dark group-hover:border-brand-dark transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-brand-accent group-hover:text-brand-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-brand-dark/70 leading-relaxed text-sm lg:text-base">{feature.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};