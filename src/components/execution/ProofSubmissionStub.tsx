import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, MapPin, Check } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { cn } from '@/lib/utils';

export const ProofSubmissionStub = () => {
    const { currentStep, submitProof } = useExecutionStore();

    // Only active during execution
    const isExecution = currentStep === 'execution_in_progress';
    const isSubmitted = ['proof_submitted', 'settlement_released', 'reputation_updated'].includes(currentStep);

    const handleSimulateUpload = () => {
        if (!isExecution) return;
        submitProof({
            gpsHash: '0x123...abc',
            photoHash: 'ipfs://Qm...',
            timestamp: Date.now()
        });
    };

    return (
        <div className={cn(
            "p-6 rounded-xl border transition-colors duration-300",
            isExecution ? "bg-white border-brand-primary/20 shadow-lg shadow-brand-primary/5" :
                isSubmitted ? "bg-green-50/30 border-green-100" :
                    "bg-gray-50 border-gray-100 opacity-60"
        )}>
            <h3 className="text-lg font-bold mb-4 text-brand-dark flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-500" />
                Proof of Work
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 bg-white">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                        {isSubmitted ? 'GPS Verified' : 'GPS Location'}
                    </span>
                    {isSubmitted && <span className="text-[10px] bg-gray-100 px-2 rounded font-mono">Lat: 40.7128</span>}
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 bg-white">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                        {isSubmitted ? 'Photo Uploaded' : 'Photo Evidence'}
                    </span>
                    {isSubmitted && <span className="text-[10px] bg-gray-100 px-2 rounded font-mono">IMG_2024.jpg</span>}
                </div>
            </div>

            <button
                onClick={handleSimulateUpload}
                disabled={!isExecution}
                className={cn(
                    "w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                    isExecution ? "bg-brand-dark text-white hover:bg-gray-800" :
                        isSubmitted ? "bg-green-500 text-white cursor-default" :
                            "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
            >
                {isSubmitted ? (
                    <>
                        <Check className="w-4 h-4" /> Proof Submitted
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" /> Submit Proof Onchain
                    </>
                )}
            </button>
        </div>
    );
};
