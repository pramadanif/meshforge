import React from 'react';
import { Upload, Camera, MapPin, Check } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { cn } from '@/lib/utils';
import { useMeshForge } from '@/hooks/useMeshForge';

export const ProofSubmissionStub = () => {
    const { currentStep, trackedIntentId } = useExecutionStore();
    const { submitProof, isPending } = useMeshForge();

    // Only active during execution
    const isExecution = currentStep === 'execution_started';
    const isSubmitted = ['proof_submitted', 'settlement_released', 'settlement_recorded'].includes(currentStep);

    const handleSubmitProof = async () => {
        if (!isExecution || trackedIntentId === null) return;
        await submitProof(trackedIntentId, 'gps-proof', 'photo-proof');
    };

    return (
        <div className={cn(
            "p-6 rounded-xl border transition-colors duration-300",
            isExecution ? "bg-white/5 border-brand-primary/20 shadow-lg shadow-brand-primary/5" :
                isSubmitted ? "bg-green-500/10 border-green-500/20" :
                    "bg-white/5 border-white/10 opacity-60"
        )}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-gray-400" />
                Proof of Work
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                        {isSubmitted ? 'GPS Verified' : 'GPS Location'}
                    </span>
                    {isSubmitted && <span className="text-[10px] bg-white/10 px-2 rounded font-mono text-gray-300">Lat: 40.7128</span>}
                </div>

                <div className="border border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                        {isSubmitted ? 'Photo Uploaded' : 'Photo Evidence'}
                    </span>
                    {isSubmitted && <span className="text-[10px] bg-white/10 px-2 rounded font-mono text-gray-300">IMG_2024.jpg</span>}
                </div>
            </div>

            <button
                onClick={handleSubmitProof}
                disabled={!isExecution || isPending}
                className={cn(
                    "w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                    isExecution ? "bg-brand-primary text-brand-dark hover:bg-brand-primary/90" :
                        isSubmitted ? "bg-green-600 text-white cursor-default" :
                            "bg-white/10 text-gray-500 cursor-not-allowed"
                )}
            >
                {isSubmitted ? (
                    <>
                        <Check className="w-4 h-4" /> Proof Submitted
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" /> {isPending ? 'Submitting...' : 'Submit Proof Onchain'}
                    </>
                )}
            </button>
        </div>
    );
};
