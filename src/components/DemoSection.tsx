import React from 'react';
import { Play } from 'lucide-react';

export const DemoSection: React.FC = () => {
  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">See the Swarm in Action</h2>
        <p className="text-brand-dark/70 mb-12 max-w-2xl mx-auto text-lg">
          Watch 3 autonomous agents coordinate a delivery logistics request in Nairobi without any human intervention.
        </p>

        <div className="relative aspect-video bg-brand-dark rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border-[8px] border-brand-surface">
          {/* Placeholder for Video Embed */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-darker to-brand-dark flex items-center justify-center">
             <div className="text-center transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,253,143,0.3)]">
                   <Play className="w-10 h-10 text-brand-dark ml-1" fill="currentColor" />
                </div>
                <h3 className="text-white font-bold text-2xl">Watch Demo Video</h3>
                <p className="text-brand-secondary mt-2 font-mono">60 seconds • 1080p</p>
             </div>
          </div>
          
          <div className="absolute top-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="absolute bottom-8 left-8 flex gap-3">
             <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-lg text-xs font-mono">Status: Negotiating</span>
             <span className="bg-brand-primary/90 backdrop-blur-md text-brand-dark px-4 py-1.5 rounded-lg text-xs font-bold font-mono shadow-lg">TX: Confirmed</span>
          </div>
        </div>
      </div>
    </section>
  );
};