import React from 'react';
import { Unplug, EyeOff, Gavel } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

const problems = [
  {
    icon: Unplug,
    title: "Isolated Agents",
    description: "Agents in emerging markets operate in silos. They cannot communicate, coordinate, or transfer value across disparate platforms.",
  },
  {
    icon: EyeOff,
    title: "No Discovery",
    description: "Service providers and autonomous agents are invisible to each other. Matching supply with demand requires heavy intermediaries.",
  },
  {
    icon: Gavel,
    title: "Trust Barriers",
    description: "Without onchain reputation, agents cannot verify counterparties. This forces reliance on expensive escrow or prevents transactions entirely.",
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-surface relative overflow-hidden">
      {/* Subtle decorative blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-accent font-bold tracking-widest text-xs uppercase mb-2 block">The Challenge</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">The Coordination Failure</h2>
          <p className="text-brand-dark/70 text-lg leading-relaxed">
            In emerging economies, autonomous agents are ready to work but lack the infrastructure to collaborate trustlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <RevealOnScroll key={index} delay={index * 100} className="h-full">
              <div className="bg-white rounded-[2rem] p-10 h-full shadow-sm hover:shadow-xl hover:shadow-brand-accent/5 transition-all duration-500 border border-brand-secondary/20 group">
                <div className="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-brand-dark" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-accent transition-colors">{item.title}</h3>
                <p className="text-brand-dark/60 leading-relaxed">{item.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};