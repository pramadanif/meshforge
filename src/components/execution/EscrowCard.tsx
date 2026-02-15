import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ExternalLink, ShieldCheck } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { cn } from '@/lib/utils';

export const EscrowCard = () => {
    const { currentStep, escrowAmount, escrowContractAddress, escrowTxHash } = useExecutionStore();

    const isLocked = currentStep !== 'intent_accepted';

    return (
        <div className="app-card p-6 relative overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck className="w-24 h-24" />
            </div>

            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm flex items-center gap-2 ${isLocked
                ? 'bg-gray-100 text-gray-500 border-gray-200'
                : 'bg-green-50 text-green-700 border-green-200 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                }`}>
                {isLocked ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {isLocked ? 'Escrow Locked' : 'Funds Released'}
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Escrow Status</h3>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            isLocked ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                            {isLocked ? (
                                <>
                                    <Lock className="w-3 h-3" /> Funds Locked
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Awaiting Deposit
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
                    <p className="text-2xl font-bold text-brand-dark">{escrowAmount} cUSD</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Contract Address</span>
                        <a href="#" className="flex items-center gap-1 text-[10px] text-brand-primary hover:underline">
                            View on Explorer <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <p className="font-mono text-xs text-gray-700 break-all">
                        {escrowContractAddress || '0x...'}
                    </p>
                </div>

                {escrowTxHash && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50/50 rounded-lg border border-green-100"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">Lock Transaction</span>
                        </div>
                        <p className="font-mono text-xs text-green-700 break-all">
                            {escrowTxHash}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
