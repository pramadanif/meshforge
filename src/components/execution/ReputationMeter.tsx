import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Activity, Users } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { cn } from '@/lib/utils';

export const ReputationMeter = () => {
    const { currentStep, reputation } = useExecutionStore();
    const isUpdating = currentStep === 'settlement_recorded';
    const displayValue = reputation;

    return (
        <div className="app-card p-6 hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    Trust Score
                </h3>
                {isUpdating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Updated Onchain
                    </motion.div>
                )}
            </div>

            <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-display font-black text-white tracking-tight leading-none">
                    {displayValue}
                </span>
                <span className="text-sm text-gray-400 font-medium mb-1.5">/ 1000</span>
            </div>

            {/* Meter Bar */}
            <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-6 relative inner-shadow">
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${(displayValue / 1000) * 100}%` }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full relative overflow-hidden"
                    transition={{ type: 'spring', stiffness: 50 }}
                >
                    <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                </motion.div>
                {/* Particles Effect (Simulated with div for now) */}
                {isUpdating && (
                    <motion.div
                        className="absolute top-0 bottom-0 right-0 w-10 bg-white/20 blur-sm"
                        animate={{ x: [0, 200] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <Activity className="w-3 h-3" /> Success Rate
                    </div>
                    <p className={cn("font-bold", isUpdating ? "text-green-400" : "text-gray-200")}>
                        {isUpdating ? '98.5%' : '98.2%'}
                    </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <Users className="w-3 h-3" /> Volume
                    </div>
                    <p className={cn("font-bold", isUpdating ? "text-brand-primary" : "text-gray-200")}>
                        {isUpdating ? '$12.4k' : '$12.1k'}
                    </p>
                </div>
            </div>
        </div>
    );
};
