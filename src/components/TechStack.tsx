import React from 'react';

const techs = ["Celo Sepolia", "ERC-8004", "x402", "Merkle Proofs", "Prisma Indexer", "Trust Graph"];

export const TechStack: React.FC = () => {
  return (
    <section className="py-10 bg-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-brand-dark uppercase tracking-widest mb-6 opacity-80">Powered By Best-in-Class Infrastructure</p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12">
           {techs.map((tech) => (
             <div key={tech} className="px-5 py-2 rounded-full border border-brand-dark/20 text-brand-dark font-bold text-base flex items-center gap-2 hover:bg-brand-dark hover:text-brand-primary transition-all cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {tech}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};