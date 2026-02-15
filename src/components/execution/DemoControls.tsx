import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';

export const DemoControls = () => {
    const store = useExecutionStore();
    const [isPlaying, setIsPlaying] = useState(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runDemo = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        store.reset(); // Reset to start

        // 1. Initial State (already set by reset)
        // Intent Accepted -> Awaiting Escrow
        await delay(1000);

        // 2. Lock Escrow
        store.lockEscrow('0x7f...3a2b', '0xabc...def');
        await delay(3000);

        // 3. Start Execution
        store.startExecution();
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
            store.updateProgress(i);
            await delay(500);
        }

        // 4. Submit Proof
        store.submitProof({
            gpsHash: '0x101...999',
            photoHash: 'ipfs://QmHash...',
        });
        await delay(2000);

        // 5. Release Settlement
        store.releaseSettlement('0x88...11a');
        await delay(2500);

        // 6. Update Reputation
        store.updateReputation(412, 449);

        setIsPlaying(false);
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={runDemo}
                disabled={isPlaying}
                className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Play className="w-4 h-4 fill-current" />
                {isPlaying ? 'Running Demo...' : 'Run Autonomous Execution Demo'}
            </button>

            <button
                onClick={() => store.reset()}
                disabled={isPlaying}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
            >
                <RotateCcw className="w-4 h-4" />
                Reset
            </button>
        </div>
    );
};
