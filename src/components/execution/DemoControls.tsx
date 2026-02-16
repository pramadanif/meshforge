import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { useMeshForge } from '@/hooks/useMeshForge';

export const DemoControls = () => {
    const { trackedIntentId, reset } = useExecutionStore();
    const { lockEscrow, startExecution, settle, commitMerkleRoot, setCrossBorderRoute, setCrossBorderStablecoins, openDispute, isPending } = useMeshForge();

    const runStep = async () => {
        if (trackedIntentId === null) return;
        await lockEscrow(trackedIntentId);
        await startExecution(trackedIntentId);
    };

    const runSettle = async () => {
        if (trackedIntentId === null) return;
        await settle(trackedIntentId);
    };

    const runVerifiability = async () => {
        if (trackedIntentId === null) return;
        await commitMerkleRoot(trackedIntentId, `intent-${trackedIntentId}-delivery-proof-root`, 3);
    };

    const runCrossBorder = async () => {
        if (trackedIntentId === null) return;
        await setCrossBorderRoute(trackedIntentId, 1, 2);
        await setCrossBorderStablecoins(trackedIntentId, 'cUSD', 'USDm');
    };

    const runDispute = async () => {
        if (trackedIntentId === null) return;
        await openDispute(trackedIntentId, 'Fallback review requested for high value route');
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={runStep}
                disabled={isPending || trackedIntentId === null}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                {isPending ? 'Submitting...' : 'Lock + Start Execution'}
            </button>

            <button
                onClick={runSettle}
                disabled={isPending || trackedIntentId === null}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                Settle
            </button>

            <button
                onClick={runVerifiability}
                disabled={isPending || trackedIntentId === null}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                Commit Merkle
            </button>

            <button
                onClick={runCrossBorder}
                disabled={isPending || trackedIntentId === null}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-700 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                Set Cross-Border
            </button>

            <button
                onClick={runDispute}
                disabled={isPending || trackedIntentId === null}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                Open Dispute
            </button>

            <button
                onClick={() => reset()}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
                <RotateCcw className="w-4 h-4" />
                Reset
            </button>
        </div>
    );
};
