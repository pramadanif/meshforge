import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowUpRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';

interface LogEntry {
    id: string;
    title: string;
    time: string;
    icon: React.ElementType;
    hash?: string;
    type: 'info' | 'success' | 'warning';
}

export const TransactionLog = () => {
    const {
        currentStep,
        escrowTxHash,
        settlementTxHash,
        executionStartTime
    } = useExecutionStore();

    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        const newLogs: LogEntry[] = [];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Initial Intent Accepted
        if (logs.length === 0) {
            newLogs.push({
                id: 'intent',
                title: 'Intent Accepted by Agent B',
                time: time,
                icon: FileText,
                type: 'info'
            });
        }

        if (currentStep === 'escrow_locked' && !logs.find(l => l.id === 'escrow')) {
            newLogs.push({
                id: 'escrow',
                title: 'Escrow Locked in Vault',
                time: time,
                icon: ShieldCheck,
                hash: escrowTxHash || undefined,
                type: 'success'
            });
        }

        if (currentStep === 'execution_in_progress' && !logs.find(l => l.id === 'execution')) {
            newLogs.push({
                id: 'execution',
                title: 'Execution Started',
                time: time,
                icon: ArrowUpRight,
                type: 'info'
            });
        }

        if (currentStep === 'proof_submitted' && !logs.find(l => l.id === 'proof')) {
            newLogs.push({
                id: 'proof',
                title: 'Proof of Work Submitted',
                time: time,
                icon: FileText,
                type: 'info'
            });
        }

        if (currentStep === 'settlement_released' && !logs.find(l => l.id === 'settlement')) {
            newLogs.push({
                id: 'settlement',
                title: 'Payment Released to Agent B',
                time: time,
                icon: CheckCircle2,
                hash: settlementTxHash || undefined,
                type: 'success'
            });
        }

        if (currentStep === 'reputation_updated' && !logs.find(l => l.id === 'reputation')) {
            newLogs.push({
                id: 'reputation',
                title: 'Reputation Score Updated',
                time: time,
                icon: CheckCircle2,
                type: 'success'
            });
        }

        if (newLogs.length > 0) {
            setLogs(prev => [...newLogs, ...prev]);
        }
    }, [currentStep, escrowTxHash, settlementTxHash]);

    return (
        <div className="app-card p-6 h-full max-h-[400px] overflow-hidden flex flex-col bg-white">
            <h3 className="text-lg font-bold mb-4 text-brand-dark flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" />
                Transaction Log
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                <AnimatePresence initial={false} mode='popLayout'>
                    {logs.map((log) => (
                        <motion.div
                            layout
                            key={log.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                        >
                            <div className={`mt-0.5 p-1.5 rounded-full ${log.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                <log.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-sm font-medium text-brand-dark">{log.title}</p>
                                    <span className="text-[10px] text-gray-400 font-mono">{log.time}</span>
                                </div>
                                {log.hash && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono border border-gray-200">
                                            Tx: {log.hash.substring(0, 6)}...{log.hash.substring(log.hash.length - 4)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {logs.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            Waiting for network activity...
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};
