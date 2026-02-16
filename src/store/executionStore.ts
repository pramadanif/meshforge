import { create } from 'zustand';

export type ExecutionStep =
    | 'broadcasted'
    | 'intent_accepted'
    | 'escrow_locked'
    | 'execution_started'
    | 'proof_submitted'
    | 'settlement_released'
    | 'settlement_recorded';

export interface ExecutionEventLog {
    id: string;
    intentId: number;
    step: ExecutionStep;
    txHash?: string;
    timestamp: number;
}

export interface ExecutionState {
    trackedIntentId: number | null;
    currentStep: ExecutionStep;
    escrowTxHash: string | null;
    escrowAmount: number;
    escrowContractAddress: string | null;
    proofData: {
        gpsHash?: string;
        photoHash?: string;
        timestamp?: number;
    } | null;
    settlementTxHash: string | null;
    reputation: number;
    eventLogs: ExecutionEventLog[];

    setTrackedIntent: (intentId: number | null) => void;
    setStep: (step: ExecutionStep) => void;
    onIntentAccepted: (intentId: number, txHash?: string) => void;
    onEscrowLocked: (intentId: number, amount: number, txHash?: string) => void;
    onExecutionStarted: (intentId: number, txHash?: string) => void;
    onProofSubmitted: (intentId: number, gpsHash: string, photoHash: string, txHash?: string) => void;
    onSettlementReleased: (intentId: number, txHash?: string) => void;
    onSettlementRecorded: (intentId: number, txHash?: string) => void;
    setReputation: (value: number) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
    trackedIntentId: null,
    currentStep: 'broadcasted',
    escrowTxHash: null,
    escrowAmount: 0,
    escrowContractAddress: null,
    proofData: null,
    settlementTxHash: null,
    reputation: 0,
    eventLogs: [],

    setTrackedIntent: (intentId) => set({ trackedIntentId: intentId }),

    setStep: (step) => set({ currentStep: step }),

    onIntentAccepted: (intentId, txHash) => set((state) => ({
        currentStep: 'intent_accepted',
        eventLogs: [{
            id: `accepted-${intentId}-${Date.now()}`,
            intentId,
            step: 'intent_accepted',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    onEscrowLocked: (intentId, amount, txHash) => set((state) => ({
        currentStep: 'escrow_locked',
        escrowTxHash: txHash,
        escrowAmount: amount,
        eventLogs: [{
            id: `escrow-${intentId}-${Date.now()}`,
            intentId,
            step: 'escrow_locked',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    onExecutionStarted: (intentId, txHash) => set((state) => ({
        currentStep: 'execution_started',
        eventLogs: [{
            id: `execution-${intentId}-${Date.now()}`,
            intentId,
            step: 'execution_started',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    onProofSubmitted: (intentId, gpsHash, photoHash, txHash) => set((state) => ({
        currentStep: 'proof_submitted',
        proofData: { gpsHash, photoHash, timestamp: Date.now() },
        eventLogs: [{
            id: `proof-${intentId}-${Date.now()}`,
            intentId,
            step: 'proof_submitted',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    onSettlementReleased: (intentId, txHash) => set((state) => ({
        currentStep: 'settlement_released',
        settlementTxHash: txHash,
        eventLogs: [{
            id: `settled-${intentId}-${Date.now()}`,
            intentId,
            step: 'settlement_released',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    onSettlementRecorded: (intentId, txHash) => set((state) => ({
        currentStep: 'settlement_recorded',
        eventLogs: [{
            id: `recorded-${intentId}-${Date.now()}`,
            intentId,
            step: 'settlement_recorded',
            txHash,
            timestamp: Date.now(),
        }, ...state.eventLogs],
    })),

    setReputation: (value) => set({ reputation: value }),

    reset: () => set({
        trackedIntentId: null,
        currentStep: 'broadcasted',
        escrowTxHash: null,
        escrowAmount: 0,
        escrowContractAddress: null,
        proofData: null,
        settlementTxHash: null,
        reputation: 0,
        eventLogs: [],
    })
}));
