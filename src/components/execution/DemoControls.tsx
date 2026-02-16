import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { useMeshForge } from '@/hooks/useMeshForge';

export const DemoControls = () => {
    const { trackedIntentId, reset } = useExecutionStore();
    const { lockEscrow, startExecution, settle, isPending } = useMeshForge();

    const runStep = async () => {
        if (trackedIntentId === null) return;
        await lockEscrow(trackedIntentId);
        await startExecution(trackedIntentId);
    };

    const runSettle = async () => {
        if (trackedIntentId === null) return;
        await settle(trackedIntentId);
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
