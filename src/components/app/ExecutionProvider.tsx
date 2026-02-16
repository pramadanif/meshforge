'use client';

import React from 'react';
import { useAccount, usePublicClient, useWatchContractEvent } from 'wagmi';
import {
    AGENT_REGISTRY_ABI,
    AGENT_REGISTRY_ADDRESS,
    INTENT_MESH_ABI,
    INTENT_MESH_ADDRESS,
} from '@/lib/contracts';
import { useExecutionStore } from '@/store/executionStore';

export function ExecutionProvider({ children }: { children: React.ReactNode }) {
    const { trackedIntentId, onIntentAccepted, onEscrowLocked, onExecutionStarted, onProofSubmitted, onSettlementReleased, onSettlementRecorded, setReputation } = useExecutionStore();
    const { address } = useAccount();
    const publicClient = usePublicClient();

    const isTracked = (intentId: bigint) => trackedIntentId !== null && Number(intentId) === trackedIntentId;

    useWatchContractEvent({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        eventName: 'IntentAccepted',
        onLogs: (logs) => {
            logs.forEach((log) => {
                const args = log.args as { intentId?: bigint };
                if (!args.intentId || !isTracked(args.intentId)) return;
                onIntentAccepted(Number(args.intentId), log.transactionHash);
            });
        },
    });

    useWatchContractEvent({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        eventName: 'EscrowLocked',
        onLogs: (logs) => {
            logs.forEach((log) => {
                const args = log.args as { intentId?: bigint; amount?: bigint };
                if (!args.intentId || !args.amount || !isTracked(args.intentId)) return;
                onEscrowLocked(Number(args.intentId), Number(args.amount), log.transactionHash);
            });
        },
    });

    useWatchContractEvent({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        eventName: 'ExecutionStarted',
        onLogs: (logs) => {
            logs.forEach((log) => {
                const args = log.args as { intentId?: bigint };
                if (!args.intentId || !isTracked(args.intentId)) return;
                onExecutionStarted(Number(args.intentId), log.transactionHash);
            });
        },
    });

    useWatchContractEvent({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        eventName: 'ProofSubmitted',
        onLogs: (logs) => {
            logs.forEach((log) => {
                const args = log.args as { intentId?: bigint; gpsHash?: `0x${string}`; photoHash?: `0x${string}` };
                if (!args.intentId || !args.gpsHash || !args.photoHash || !isTracked(args.intentId)) return;
                onProofSubmitted(Number(args.intentId), args.gpsHash, args.photoHash, log.transactionHash);
            });
        },
    });

    useWatchContractEvent({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        eventName: 'SettlementReleased',
        onLogs: (logs) => {
            logs.forEach((log) => {
                const args = log.args as { intentId?: bigint };
                if (!args.intentId || !isTracked(args.intentId)) return;
                onSettlementReleased(Number(args.intentId), log.transactionHash);
            });
        },
    });

    useWatchContractEvent({
        address: AGENT_REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        eventName: 'SettlementRecorded',
        onLogs: async (logs) => {
            for (const log of logs) {
                const args = log.args as { intentId?: bigint };
                if (!args.intentId || !isTracked(args.intentId)) continue;
                onSettlementRecorded(Number(args.intentId), log.transactionHash);

                if (!publicClient || !address) continue;
                const profile = await publicClient.readContract({
                    address: AGENT_REGISTRY_ADDRESS,
                    abi: AGENT_REGISTRY_ABI,
                    functionName: 'getAgentProfile',
                    args: [address],
                });
                const reputation = profile[1] as bigint;
                setReputation(Number(reputation));
            }
        },
    });

    return <>{children}</>;
}
