import { create } from 'zustand';

export type ExecutionStep =
    | 'intent_accepted'
    | 'escrow_locked'
    | 'execution_in_progress'
    | 'proof_submitted'
    | 'settlement_released'
    | 'reputation_updated';

export interface ExecutionState {
    currentStep: ExecutionStep;
    escrowTxHash: string | null;
    escrowAmount: number;
    escrowContractAddress: string | null;
    executionStartTime: number | null;
    executionProgress: number; // 0-100
    proofData: {
        gpsHash?: string;
        photoHash?: string;
        signature?: string;
        timestamp?: number;
    } | null;
    settlementTxHash: string | null;
    reputationUpdate: {
        before: number;
        after: number;
        delta: number;
    } | null;

    // Actions
    setStep: (step: ExecutionStep) => void;
    lockEscrow: (txHash: string, address: string) => void;
    startExecution: () => void;
    updateProgress: (progress: number) => void;
    submitProof: (data: ExecutionState['proofData']) => void;
    releaseSettlement: (txHash: string) => void;
    updateReputation: (before: number, after: number) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
    currentStep: 'intent_accepted',
    escrowTxHash: null,
    escrowAmount: 0,
    escrowContractAddress: null,
    executionStartTime: null,
    executionProgress: 0,
    proofData: null,
    settlementTxHash: null,
    reputationUpdate: null,

    setStep: (step) => set({ currentStep: step }),

    lockEscrow: (txHash, address) => set({
        currentStep: 'escrow_locked',
        escrowTxHash: txHash,
        escrowContractAddress: address
    }),

    startExecution: () => set({
        currentStep: 'execution_in_progress',
        executionStartTime: Date.now(),
        executionProgress: 0
    }),

    updateProgress: (progress) => set({ executionProgress: progress }),

    submitProof: (data) => set({
        currentStep: 'proof_submitted',
        proofData: data
    }),

    releaseSettlement: (txHash) => set({
        currentStep: 'settlement_released',
        settlementTxHash: txHash
    }),

    updateReputation: (before, after) => set({
        currentStep: 'reputation_updated',
        reputationUpdate: { before, after, delta: after - before }
    }),

    reset: () => set({
        currentStep: 'intent_accepted',
        escrowTxHash: null,
        escrowContractAddress: null,
        executionStartTime: null,
        executionProgress: 0,
        proofData: null,
        settlementTxHash: null,
        reputationUpdate: null,
    })
}));
