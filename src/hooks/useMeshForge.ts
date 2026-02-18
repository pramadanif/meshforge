import { useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useReadContracts } from 'wagmi';
import {
    AGENT_FACTORY_ABI,
    AGENT_FACTORY_ADDRESS,
    AGENT_REGISTRY_ABI,
    AGENT_REGISTRY_ADDRESS,
    AGENT_WALLET_ABI,
    INTENT_MESH_ABI,
    INTENT_MESH_ADDRESS,
} from '@/lib/contracts';
import { encodeFunctionData, formatEther, parseEther, pad, stringToHex } from 'viem';
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

type IntentMeshFunctionName = 'broadcastIntent' | 'acceptIntent' | 'lockEscrow' | 'startExecution' | 'submitProof' | 'commitMerkleRoot' | 'setCrossBorderRoute' | 'setCrossBorderStablecoins' | 'openDispute' | 'settle';
type IntentMeshArgs =
    | readonly [string, string, bigint]
    | readonly [bigint]
    | readonly [bigint, `0x${string}`, `0x${string}`]
    | readonly [bigint, `0x${string}`, bigint]
    | readonly [bigint, bigint, bigint]
    | readonly [bigint, string, string]
    | readonly [bigint, string];

export function useMeshForge() {
    const { address } = useAccount();
    const { writeContractAsync, data: hash, error, isPending } = useWriteContract();

    const { data: agentWalletAddress } = useReadContract({
        address: AGENT_FACTORY_ADDRESS,
        abi: AGENT_FACTORY_ABI,
        functionName: 'controllerToWallet',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const resolvedAgentWallet = (agentWalletAddress && agentWalletAddress !== '0x0000000000000000000000000000000000000000')
        ? agentWalletAddress
        : null;

    const executeViaAgentWallet = async (
        functionName: IntentMeshFunctionName,
        args: IntentMeshArgs
    ) => {
        if (!resolvedAgentWallet) {
            throw new Error('No AgentWallet found for connected controller. Create your agent first.');
        }

        const calldata = encodeFunctionData({
            abi: INTENT_MESH_ABI,
            functionName,
            args,
        });

        return writeContractAsync({
            address: resolvedAgentWallet,
            abi: AGENT_WALLET_ABI,
            functionName: 'execute',
            args: [INTENT_MESH_ADDRESS, calldata],
        });
    };

    const createAgent = async (metadataURI: string) => {
        return writeContractAsync({
            address: AGENT_FACTORY_ADDRESS,
            abi: AGENT_FACTORY_ABI,
            functionName: 'createAgent',
            args: [metadataURI],
        });
    };

    const broadcastIntent = async (title: string, description: string, amount: string) => {
        return executeViaAgentWallet('broadcastIntent', [title, description, parseEther(amount)]);
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
        return executeViaAgentWallet('acceptIntent', [BigInt(intentId)]);
    };

    const lockEscrow = async (intentId: number) => {
        return executeViaAgentWallet('lockEscrow', [BigInt(intentId)]);
    };

    const startExecution = async (intentId: number) => {
        return executeViaAgentWallet('startExecution', [BigInt(intentId)]);
    };

    const submitProof = async (intentId: number, gpsHash: string, photoHash: string) => {
        return executeViaAgentWallet('submitProof', [BigInt(intentId), asBytes32(gpsHash), asBytes32(photoHash)]);
    };

    const settle = async (intentId: number) => {
        return executeViaAgentWallet('settle', [BigInt(intentId)]);
    };

    const commitMerkleRoot = async (intentId: number, merkleRoot: string, step: number) => {
        return executeViaAgentWallet('commitMerkleRoot', [BigInt(intentId), asBytes32(merkleRoot), BigInt(step)]);
    };

    const setCrossBorderRoute = async (intentId: number, sourceRegion: number, destinationRegion: number) => {
        return executeViaAgentWallet('setCrossBorderRoute', [BigInt(intentId), BigInt(sourceRegion), BigInt(destinationRegion)]);
    };

    const setCrossBorderStablecoins = async (intentId: number, sourceStable: string, destinationStable: string) => {
        return executeViaAgentWallet('setCrossBorderStablecoins', [BigInt(intentId), sourceStable, destinationStable]);
    };

    const openDispute = async (intentId: number, reason: string) => {
        return executeViaAgentWallet('openDispute', [BigInt(intentId), reason]);
    };

    return {
        createAgent,
        createIntent,
        broadcastIntent,
        acceptIntent,
        lockEscrow,
        startExecution,
        submitProof,
        commitMerkleRoot,
        setCrossBorderRoute,
        setCrossBorderStablecoins,
        openDispute,
        settle,
        agentWalletAddress: resolvedAgentWallet,
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
            requesterAgentId: bigint;
            executorAgentId: bigint;
            requester: string;
            executor: string;
            title: string;
            description: string;
            value: bigint;
            createdAt: bigint;
            status: bigint;
            offchainMerkleRoot: `0x${string}`;
            disputed: boolean;
            fallbackResolved: boolean;
            sourceRegion: bigint;
            destinationRegion: bigint;
        };
        return {
            id: i.id.toString(),
            creatorId: i.requester,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.value)),
            deadline: 0,
            status: mapIntentStatus(Number(i.status)),
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
            notes: '',
            merkleHash: i.offchainMerkleRoot,
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
            requesterAgentId: bigint;
            executorAgentId: bigint;
            requester: string;
            executor: string;
            title: string;
            description: string;
            value: bigint;
            createdAt: bigint;
            status: bigint;
            offchainMerkleRoot: `0x${string}`;
            disputed: boolean;
            fallbackResolved: boolean;
            sourceRegion: bigint;
            destinationRegion: bigint;
        };
        return {
            id: i.id.toString(),
            creatorId: i.requester,
            title: i.title,
            description: i.description,
            amount: Number(formatEther(i.value)),
            deadline: 0,
            status: mapIntentStatus(Number(i.status)),
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
            notes: '',
            merkleHash: i.offchainMerkleRoot,
        } as Intent;
    }, [result]);

    return { intent, isLoading };
}
