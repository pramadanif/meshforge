import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    const { eventLogs } = useExecutionStore();

    const logs: LogEntry[] = eventLogs.map((entry) => {
        const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        switch (entry.step) {
            case 'intent_accepted':
                return { id: entry.id, title: 'Intent Accepted', time, icon: FileText, hash: entry.txHash, type: 'info' };
            case 'escrow_locked':
                return { id: entry.id, title: 'Escrow Locked', time, icon: ShieldCheck, hash: entry.txHash, type: 'success' };
            case 'execution_started':
                return { id: entry.id, title: 'Execution Started', time, icon: ArrowUpRight, hash: entry.txHash, type: 'info' };
            case 'proof_submitted':
                return { id: entry.id, title: 'Proof Submitted', time, icon: FileText, hash: entry.txHash, type: 'info' };
            case 'settlement_released':
                return { id: entry.id, title: 'Settlement Released', time, icon: CheckCircle2, hash: entry.txHash, type: 'success' };
            case 'settlement_recorded':
                return { id: entry.id, title: 'Settlement Recorded', time, icon: CheckCircle2, hash: entry.txHash, type: 'success' };
            default:
                return { id: entry.id, title: 'Lifecycle Update', time, icon: FileText, hash: entry.txHash, type: 'info' };
        }
    });

    return (
        <div className="app-card p-6 h-full max-h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
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
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                        >
                            <div className={`mt-0.5 p-1.5 rounded-full ${log.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                                <log.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-sm font-medium text-white">{log.title}</p>
                                    <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                                </div>
                                {log.hash && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded font-mono border border-white/10">
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
