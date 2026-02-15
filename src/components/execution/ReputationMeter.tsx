import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Activity, Users } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { cn } from '@/lib/utils';

export const ReputationMeter = () => {
    const { reputationUpdate, currentStep } = useExecutionStore();
    const [displayValue, setDisplayValue] = useState(412); // Initial mocked value

    useEffect(() => {
        if (reputationUpdate) {
            // Animate the number counting up
            const interval = setInterval(() => {
                setDisplayValue(prev => {
                    if (prev < reputationUpdate.after) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [reputationUpdate]);

    const isUpdating = currentStep === 'reputation_updated';

    return (
        <div className="app-card p-6 bg-white hover:bg-gray-50/50">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    Trust Score
                </h3>
                {reputationUpdate && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-bold"
                    >
                        <TrendingUp className="w-4 h-4" />
                        +{reputationUpdate.delta}
                    </motion.div>
                )}
            </div>

            <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-display font-black text-brand-dark tracking-tight leading-none">
                    {displayValue}
                </span>
                <span className="text-sm text-gray-400 font-medium mb-1.5">/ 1000</span>
            </div>

            {/* Meter Bar */}
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6 relative inner-shadow">
                <motion.div
                    initial={{ width: '41.2%' }}
                    animate={{ width: isUpdating ? `${(displayValue / 1000) * 100}%` : '41.2%' }}
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
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Activity className="w-3 h-3" /> Success Rate
                    </div>
                    <p className={cn("font-bold", isUpdating ? "text-green-600" : "text-gray-700")}>
                        {isUpdating ? '98.5%' : '98.2%'}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Users className="w-3 h-3" /> Volume
                    </div>
                    <p className={cn("font-bold", isUpdating ? "text-brand-primary" : "text-gray-700")}>
                        {isUpdating ? '$12.4k' : '$12.1k'}
                    </p>
                </div>
            </div>
        </div>
    );
};
