import { useMemo } from 'react';
import { useReadContract, useWriteContract, useReadContracts } from 'wagmi';
import {
    AGENT_FACTORY_ABI,
    AGENT_FACTORY_ADDRESS,
    AGENT_REGISTRY_ABI,
    AGENT_REGISTRY_ADDRESS,
    INTENT_MESH_ABI,
    INTENT_MESH_ADDRESS,
} from '@/lib/contracts';
import { formatEther, parseEther, pad, stringToHex } from 'viem';
import type { Intent } from '@/types';

function asBytes32(value: string) {
    return pad(stringToHex(value), { size: 32 });
}

function mapIntentStatus(status: number): 'open' | 'accepted' | 'in_progress' | 'completed' {
    if (status === 1) return 'accepted';
    if (status === 2 || status === 3 || status === 4) return 'in_progress';
    if (status === 5) return 'completed';
    return 'open';
}

export function useMeshForge() {
    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const createAgent = async (metadataURI: string) => {
        writeContract({
            address: AGENT_FACTORY_ADDRESS,
            abi: AGENT_FACTORY_ABI,
            functionName: 'createAgent',
            args: [metadataURI],
        });
    };

    const broadcastIntent = async (title: string, description: string, amount: string) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'broadcastIntent',
            args: [title, description, parseEther(amount)],
        });
    };

    const createIntent = async (
        title: string,
        description: string,
        amount: string,
        _deadline?: number,
        _category?: string,
    ) => {
        await broadcastIntent(title, description, amount);
    };

    const acceptIntent = async (intentId: number) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'acceptIntent',
            args: [BigInt(intentId)],
        });
    };

    const lockEscrow = async (intentId: number) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'lockEscrow',
            args: [BigInt(intentId)],
        });
    };

    const startExecution = async (intentId: number) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'startExecution',
            args: [BigInt(intentId)],
        });
    };

    const submitProof = async (intentId: number, gpsHash: string, photoHash: string) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'submitProof',
            args: [BigInt(intentId), asBytes32(gpsHash), asBytes32(photoHash)],
        });
    };

    const settle = async (intentId: number) => {
        writeContract({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'settle',
            args: [BigInt(intentId)],
        });
    };

    return {
        createAgent,
        createIntent,
        broadcastIntent,
        acceptIntent,
        lockEscrow,
        startExecution,
        submitProof,
        settle,
        hash,
        error,
        isPending,
    };
}

export function useAgentReputation(address: `0x${string}`) {
    const { data, isLoading } = useReadContract({
        address: AGENT_REGISTRY_ADDRESS,
        abi: AGENT_REGISTRY_ABI,
        functionName: 'getAgentProfile',
        args: [address],
    });

    return {
        reputation: data ? Number(data[0]) : 0,
        completedIntents: data ? Number(data[1]) : 0,
        totalVolume: data ? Number(data[2]) : 0,
        isLoading,
    };
}

export function useIntents() {
    const { data: count } = useReadContract({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        functionName: 'intentCount',
    });

    // Create array of indices [0, 1, ... count-1]
    const ids = count ? Array.from({ length: Number(count) }, (_, i) => i) : [];

    const { data: intentsRaw, isLoading } = useReadContracts({
        contracts: ids.map((id) => ({
            address: INTENT_MESH_ADDRESS,
            abi: INTENT_MESH_ABI,
            functionName: 'getIntent',
            args: [BigInt(id)],
        })),
    });

    const intents = intentsRaw?.map((result) => {
        if (result.status === 'failure' || !result.result) return null;
        const i = result.result as unknown as {
            id: bigint;
            requester: string;
            title: string;
            description: string;
            value: bigint;
            createdAt: bigint;
            status: number;
        };
        return {
            id: i.id.toString(),
            creatorId: i.requester,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.value)),
            deadline: 0,
            status: mapIntentStatus(i.status),
            currency: 'cUSD',
            location: 'On-Chain',
            category: 'General',
            skills: [],
            minReputation: 0,
            confidence: 100,
            creatorName: `${i.requester.slice(0, 6)}...${i.requester.slice(-4)}`,
            createdAt: new Date(Number(i.createdAt) * 1000).toISOString(),
            broadcastTime: 0,
            offers: [],
            merkleHash: '',
            notes: '',
        } as Intent;
    }).filter(Boolean) || [];

    return { intents, isLoading };
}

export function useIntent(id: number | undefined) {
    const { data: result, isLoading } = useReadContract({
        address: INTENT_MESH_ADDRESS,
        abi: INTENT_MESH_ABI,
        functionName: 'getIntent',
        args: id !== undefined ? [BigInt(id)] : undefined,
        query: {
            enabled: id !== undefined,
        }
    });

    const intent = useMemo(() => {
        if (!result) return null;
        const i = result as unknown as {
            id: bigint;
            requester: string;
            title: string;
            description: string;
            value: bigint;
            createdAt: bigint;
            status: number;
        };
        return {
            id: i.id.toString(),
            creatorId: i.requester,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.value)),
            deadline: 0,
            status: mapIntentStatus(i.status),
            currency: 'cUSD',
            location: 'On-Chain',
            category: 'General',
            skills: [],
            minReputation: 0,
            confidence: 100,
            creatorName: `${i.requester.slice(0, 6)}...${i.requester.slice(-4)}`,
            createdAt: new Date(Number(i.createdAt) * 1000).toISOString(),
            broadcastTime: 0,
            offers: [],
            merkleHash: '',
            notes: '',
        } as Intent;
    }, [result]);

    return { intent, isLoading };
}
