import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Upload, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { useExecutionStore, ExecutionStep } from '@/store/executionStore';
import { cn } from '@/lib/utils';

const STEPS = [
    { id: 'broadcasted', label: 'Broadcasted', icon: Check },
    { id: 'intent_accepted', label: 'Intent Accepted', icon: Check },
    { id: 'escrow_locked', label: 'Escrow Locked', icon: Lock },
    { id: 'execution_started', label: 'Execution Started', icon: Play },
    { id: 'proof_submitted', label: 'Proof Submitted', icon: Upload },
    { id: 'settlement_released', label: 'Settlement Released', icon: CheckCircle2 },
    { id: 'settlement_recorded', label: 'Settlement Recorded', icon: TrendingUp },
];

export const ExecutionTimeline = () => {
    const { currentStep } = useExecutionStore();

    const getCurrentStepIndex = (step: ExecutionStep) => {
        return STEPS.findIndex((s) => s.id === step);
    };

    const activeIndex = getCurrentStepIndex(currentStep);

    return (
        <div className="app-card p-6">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-primary" />
                Live Execution Status
            </h3>
            <div className="relative space-y-8 pl-2">
                {/* Vertical Bar */}
                <div className="absolute left-[29px] top-2 bottom-4 w-0.5 bg-white/10" />

                {STEPS.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isCompleted = index < activeIndex;
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0.5, x: -10 }}
                            animate={{ opacity: isActive || isCompleted ? 1 : 0.4, x: 0 }}
                            className="relative flex items-center gap-4 z-10"
                        >
                            {/* Step Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${isActive
                                    ? 'bg-brand-primary text-brand-dark scale-110 shadow-[0_0_20px_rgba(4,57,21,0.3)]'
                                    : isCompleted
                                        ? 'bg-brand-secondary text-brand-dark'
                                        : 'bg-white/10 text-gray-500'
                                    }`}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </div>

                            <div className="flex flex-col">
                                <span className={cn(
                                    "font-medium text-sm transition-colors duration-300",
                                    isActive ? "text-white font-bold" : "text-gray-500"
                                )}>
                                    {step.label}
                                </span>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs text-brand-primary font-medium"
                                    >
                                        Processing...
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
