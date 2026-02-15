import { useMemo } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { MESH_FORGE_ABI, MESH_FORGE_ADDRESS } from '@/lib/contracts';
import { parseEther, formatEther } from 'viem';

export function useMeshForge() {
    const { writeContract, data: hash, error, isPending } = useWriteContract();

    // 1. Create Intent
    const createIntent = async (title: string, description: string, amount: string, deadline: number, category: string) => {
        writeContract({
            address: MESH_FORGE_ADDRESS,
            abi: MESH_FORGE_ABI,
            functionName: 'createIntent',
            args: [title, description, parseEther(amount), BigInt(deadline), category],
        });
    };

    // 2. Submit Offer
    const submitOffer = async (intentId: number, amount: string, message: string) => {
        writeContract({
            address: MESH_FORGE_ADDRESS,
            abi: MESH_FORGE_ABI,
            functionName: 'submitOffer',
            args: [BigInt(intentId), parseEther(amount), message],
        });
    };

    // 3. Accept Offer (Lock Funds)
    const acceptOffer = async (intentId: number, offerId: number, amount: string) => {
        writeContract({
            address: MESH_FORGE_ADDRESS,
            abi: MESH_FORGE_ABI,
            functionName: 'acceptOffer',
            args: [BigInt(intentId), BigInt(offerId)],
            value: parseEther(amount), // Send cUSD/CELO to contract
        });
    };

    // 4. Settle Intent (Release Funds)
    const settleIntent = async (intentId: number) => {
        writeContract({
            address: MESH_FORGE_ADDRESS,
            abi: MESH_FORGE_ABI,
            functionName: 'settleIntent',
            args: [BigInt(intentId)],
        });
    };

    return {
        createIntent,
        submitOffer,
        acceptOffer,
        settleIntent,
        hash,
        error,
        isPending,
    };
}

export function useAgentReputation(address: `0x${string}`) {
    const { data, isLoading } = useReadContract({
        address: MESH_FORGE_ADDRESS,
        abi: MESH_FORGE_ABI,
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
        address: MESH_FORGE_ADDRESS,
        abi: MESH_FORGE_ABI,
        functionName: 'intentCount',
    });

    // Create array of indices [0, 1, ... count-1]
    const ids = count ? Array.from({ length: Number(count) }, (_, i) => i) : [];

    const { data: intentsRaw, isLoading } = useReadContracts({
        contracts: ids.map((id) => ({
            address: MESH_FORGE_ADDRESS,
            abi: MESH_FORGE_ABI,
            functionName: 'getIntent',
            args: [BigInt(id)],
        })),
    });

    const intents = intentsRaw?.map((result) => {
        if (result.status === 'failure' || !result.result) return null;
        const i = result.result as unknown as {
            id: bigint;
            creator: string;
            title: string;
            description: string;
            amount: bigint;
            deadline: bigint;
            status: number;
        };
        return {
            id: i.id.toString(),
            creatorId: i.creator,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.amount)),
            deadline: Number(i.deadline),
            status: ['open', 'active', 'completed'][i.status] || 'open',
            // Default/Placeholder for missing fields
            currency: 'cUSD',
            location: 'On-Chain',
            category: 'General',
            skills: [],
            minReputation: 0,
            confidence: 100,
            creatorName: `${i.creator.slice(0, 6)}...${i.creator.slice(-4)}`,
            createdAt: new Date().toISOString(), // In a real app, fetch block timestamp
            broadcastTime: 0, // Calculated in UI or fetch block timestamp
            offers: [], // Would need another call to fetch offers
            merkleHash: '',
            notes: '',
        } as any; // Cast to any to avoid strict type checks for now, or import Intent type
    }).filter(Boolean) || [];

    return { intents, isLoading };
}

export function useIntent(id: number | undefined) {
    const { data: result, isLoading } = useReadContract({
        address: MESH_FORGE_ADDRESS,
        abi: MESH_FORGE_ABI,
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
            creator: string;
            title: string;
            description: string;
            amount: bigint;
            deadline: bigint;
            status: number;
        };
        return {
            id: i.id.toString(),
            creatorId: i.creator,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.amount)),
            deadline: Number(i.deadline),
            status: ['open', 'active', 'completed'][i.status] || 'open',
            currency: 'cUSD',
            location: 'On-Chain',
            category: 'General',
            skills: [],
            minReputation: 0,
            confidence: 100,
            creatorName: `${i.creator.slice(0, 6)}...${i.creator.slice(-4)}`,
            createdAt: new Date().toISOString(),
            broadcastTime: 0,
            offers: [],
            merkleHash: '',
            notes: '',
        } as any;
    }, [result]);

    return { intent, isLoading };
}
