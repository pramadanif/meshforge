'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Share2, MoreHorizontal, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { ExecutionTimeline } from '@/components/execution/ExecutionTimeline';
import { EscrowCard } from '@/components/execution/EscrowCard';
import { TransactionLog } from '@/components/execution/TransactionLog';
import { ReputationMeter } from '@/components/execution/ReputationMeter';
import { ProofSubmissionStub } from '@/components/execution/ProofSubmissionStub';
import { DemoControls } from '@/components/execution/DemoControls'; // Keep or remove? Keep for now as fallback/demo
import { useIntent, useMeshForge } from '@/hooks/useMeshForge';
import { useExecutionStore } from '@/store/executionStore';
import { useAccount } from 'wagmi';

export default function ExecutionPage() {
    const params = useParams();
    const intentIdStr = params.intentId as string;
    const intentId = parseInt(intentIdStr);

    // Fetch Intent Data
    const { intent, isLoading } = useIntent(isNaN(intentId) ? undefined : intentId);
    const { address } = useAccount();
    const { settleIntent, isPending: isSettling } = useMeshForge();

    // Store Synchronization
    const { setStep, lockEscrow, releaseSettlement, currentStep } = useExecutionStore();

    useEffect(() => {
        if (!intent) return;

        // Sync store with intent state
        useExecutionStore.setState({
            escrowAmount: intent.amount,
            escrowContractAddress: intentIdStr // Using ID as proxy for now, or actual contract address
        });

        if (intent.status === 'active') {
            // In a real app, check specific events, but for now map 'active' to locked
            if (currentStep !== 'escrow_locked' && currentStep !== 'execution_in_progress' && currentStep !== 'proof_submitted') {
                lockEscrow('0x...', '0x...'); // Mock tx hash if not storing it
                setStep('execution_in_progress'); // Simulate progress
            }
        } else if (intent.status === 'completed') {
            releaseSettlement('0x...');
            setStep('reputation_updated');
        }
    }, [intent, currentStep, lockEscrow, releaseSettlement, setStep, intentIdStr]);

    const handleSettle = async () => {
        if (!intent) return;
        try {
            // Mock proof for now
            await settleIntent(Number(intent.id));
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-app-neon" />
            </div>
        );
    }

    if (!intent) {
        return (
            <div className="p-6 text-center text-gray-500">
                Intent not found.
                <Link href="/dashboard" className="block mt-4 text-app-neon hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const isCreator = address && intent.creatorId.toLowerCase() === address.toLowerCase();
    const canSettle = isCreator && intent.status === 'active'; // Or 'active' means working

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-brand-dark">Execution #{intent.id}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${intent.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                intent.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    'bg-gray-50 text-gray-700 border-gray-100'
                                }`}>
                                {intent.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">Created {new Date(intent.createdAt).toLocaleDateString()} • {intent.title}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {canSettle && (
                        <button
                            onClick={handleSettle}
                            disabled={isSettling}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {isSettling ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Release Funds (Settle)
                        </button>
                    )}
                    {/* <DemoControls />  Using real data now, mostly */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Timeline & Agent Status */}
                <div className="space-y-6">
                    <ExecutionTimeline />

                    {/* Agent Mini Profile (Placeholder for now as we don't fetch worker) */}
                    <div className="app-card p-5 bg-white">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Executor Agent</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                ??
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">Unassigned / Unknown</p>
                                <p className="text-xs text-gray-500">Waiting for assignment</p>
                            </div>
                            <div className="ml-auto text-right">
                                <span className="block w-2.5 h-2.5 rounded-full bg-gray-300 ml-auto mb-1" />
                                <span className="text-[10px] text-gray-400 font-medium">Offline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column: Core Execution Actions */}
                <div className="space-y-6">
                    <EscrowCard />
                    <ProofSubmissionStub />
                </div>

                {/* Right Column: Logs & Reputation */}
                <div className="space-y-6">
                    <ReputationMeter />
                    <TransactionLog />
                </div>

            </div>
        </div>
    );
}
