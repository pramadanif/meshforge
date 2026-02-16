import { encodeFunctionData, parseEther } from 'viem';
import {
  AGENT_FACTORY_ABI,
  AGENT_FACTORY_ADDRESS,
  AGENT_WALLET_ABI,
  INTENT_MESH_ABI,
  INTENT_MESH_ADDRESS,
} from '@/lib/contracts';

export interface MeshForgeSdk {
  getAgentWallet(controller: `0x${string}`): Promise<`0x${string}` | null>;
  createAgent(metadataURI: string): Promise<`0x${string}`>;
  broadcastIntent(title: string, description: string, valueCusd: string): Promise<`0x${string}`>;
  acceptIntent(intentId: number): Promise<`0x${string}`>;
}

interface SdkConfig {
  publicClient: any;
  walletClient: any;
  controller: `0x${string}`;
}

export function createMeshForgeSdk({ publicClient, walletClient, controller }: SdkConfig): MeshForgeSdk {
  async function getAgentWallet(address: `0x${string}`): Promise<`0x${string}` | null> {
    const wallet = await publicClient.readContract({
      address: AGENT_FACTORY_ADDRESS,
      abi: AGENT_FACTORY_ABI,
      functionName: 'controllerToWallet',
      args: [address],
    });

    if (!wallet || wallet === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    return wallet;
  }

  async function createAgent(metadataURI: string): Promise<`0x${string}`> {
    const hash = await walletClient.writeContract({
      account: controller,
      address: AGENT_FACTORY_ADDRESS,
      abi: AGENT_FACTORY_ABI,
      functionName: 'createAgent',
      args: [metadataURI],
    });
    return hash;
  }

  async function executeIntent(functionName: 'broadcastIntent' | 'acceptIntent', args: readonly unknown[]): Promise<`0x${string}`> {
    const agentWallet = await getAgentWallet(controller);
    if (!agentWallet) {
      throw new Error('No AgentWallet for controller. Call createAgent() first.');
    }

    const calldata = encodeFunctionData({
      abi: INTENT_MESH_ABI,
      functionName,
      args: args as any,
    });

    return walletClient.writeContract({
      account: controller,
      address: agentWallet,
      abi: AGENT_WALLET_ABI,
      functionName: 'execute',
      args: [INTENT_MESH_ADDRESS, calldata],
    });
  }

  async function broadcastIntent(title: string, description: string, valueCusd: string): Promise<`0x${string}`> {
    return executeIntent('broadcastIntent', [title, description, parseEther(valueCusd)]);
  }

  async function acceptIntent(intentId: number): Promise<`0x${string}`> {
    return executeIntent('acceptIntent', [BigInt(intentId)]);
  }

  return {
    getAgentWallet,
    createAgent,
    broadcastIntent,
    acceptIntent,
  };
}
