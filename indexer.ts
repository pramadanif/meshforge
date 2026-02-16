import 'dotenv/config';
import { Prisma } from '@prisma/client';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { createClient as createRedisClient } from 'redis';
import { prisma } from './src/lib/prisma';

const intentMeshAddress = process.env.INTENT_MESH_ADDRESS as `0x${string}`;
const agentRegistryAddress = process.env.AGENT_REGISTRY_ADDRESS as `0x${string}`;

if (!intentMeshAddress || !agentRegistryAddress) {
  throw new Error('Missing INTENT_MESH_ADDRESS or AGENT_REGISTRY_ADDRESS');
}

const client = createPublicClient({
  chain: celoAlfajores,
  transport: http(process.env.CELO_RPC_URL ?? 'https://alfajores-forno.celo-testnet.org'),
});

const redis = createRedisClient({ url: process.env.REDIS_URL });

const events = {
  IntentAccepted: parseAbiItem('event IntentAccepted(uint256 indexed intentId, uint256 indexed executorAgentId, address indexed executor)'),
  EscrowLocked: parseAbiItem('event EscrowLocked(uint256 indexed intentId, uint256 amount)'),
  ExecutionStarted: parseAbiItem('event ExecutionStarted(uint256 indexed intentId)'),
  ProofSubmitted: parseAbiItem('event ProofSubmitted(uint256 indexed intentId, bytes32 gpsHash, bytes32 photoHash)'),
  SettlementReleased: parseAbiItem('event SettlementReleased(uint256 indexed intentId, uint256 amount, uint256 indexed executorAgentId)'),
  SettlementRecorded: parseAbiItem('event SettlementRecorded(uint256 indexed intentId, uint256 indexed agentId, uint256 value, uint256 timestamp)'),
} as const;

type Lifecycle =
  | 'ACCEPTED'
  | 'ESCROW_LOCKED'
  | 'EXECUTION_STARTED'
  | 'PROOF_SUBMITTED'
  | 'SETTLED'
  | 'SETTLEMENT_RECORDED';

async function persistExecutionLog(
  eventName: string,
  intentId: number,
  payload: Record<string, unknown>,
  txHash?: string,
  blockNumber?: bigint,
  logIndex?: number
) {
  await prisma.executionLog.create({
    data: {
      eventName,
      intentId,
      txHash: txHash ?? null,
      blockNumber: blockNumber ? Number(blockNumber) : null,
      logIndex: logIndex ?? null,
      payload: payload as any,
    },
  });
}

async function upsertIntentExecutionState(intentId: number, lifecycle: Lifecycle, txHash?: string) {
  await prisma.intentExecutionState.upsert({
    where: { intentId },
    update: {
      lifecycle,
      lastTxHash: txHash ?? null,
    },
    create: {
      intentId,
      lifecycle,
      lastTxHash: txHash ?? null,
    },
  });
}

async function upsertAgentReputation(agentId: number) {
  const reputation = await client.readContract({
    address: agentRegistryAddress,
    abi: [
      {
        type: 'function',
        name: 'getReputation',
        stateMutability: 'view',
        inputs: [{ name: 'agentId', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'getReputation',
    args: [BigInt(agentId)],
  });

  await prisma.agentReputation.upsert({
    where: { agentId },
    update: {
      reputation,
    },
    create: {
      agentId,
      reputation,
    },
  });

  await redis.set(`agent:${agentId}:reputation`, String(reputation));
}

async function main() {
  await redis.connect();

  client.watchEvent({
    address: intentMeshAddress,
    event: events.IntentAccepted,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; executorAgentId: bigint; executor: `0x${string}` };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'ACCEPTED', log.transactionHash);
        await persistExecutionLog('IntentAccepted', intentId, {
          executorAgentId: Number(args.executorAgentId),
          executor: args.executor,
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.EscrowLocked,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; amount: bigint };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'ESCROW_LOCKED', log.transactionHash);
        await persistExecutionLog('EscrowLocked', intentId, {
          amount: args.amount.toString(),
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.ExecutionStarted,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'EXECUTION_STARTED', log.transactionHash);
        await persistExecutionLog('ExecutionStarted', intentId, {}, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.ProofSubmitted,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; gpsHash: `0x${string}`; photoHash: `0x${string}` };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'PROOF_SUBMITTED', log.transactionHash);
        await persistExecutionLog('ProofSubmitted', intentId, {
          gpsHash: args.gpsHash,
          photoHash: args.photoHash,
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.SettlementReleased,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; amount: bigint; executorAgentId: bigint };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'SETTLED', log.transactionHash);
        await persistExecutionLog('SettlementReleased', intentId, {
          amount: args.amount.toString(),
          executorAgentId: Number(args.executorAgentId),
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: agentRegistryAddress,
    event: events.SettlementRecorded,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; agentId: bigint; value: bigint; timestamp: bigint };
        const intentId = Number(args.intentId);
        const agentId = Number(args.agentId);

        await upsertIntentExecutionState(intentId, 'SETTLEMENT_RECORDED', log.transactionHash);
        await persistExecutionLog('SettlementRecorded', intentId, {
          agentId,
          value: args.value.toString(),
          timestamp: Number(args.timestamp),
        }, log.transactionHash, log.blockNumber, log.logIndex);
        await upsertAgentReputation(agentId);
      }
    },
  });

  console.log('Indexer started: watching IntentAccepted, EscrowLocked, ExecutionStarted, ProofSubmitted, SettlementReleased, SettlementRecorded');
}

main().catch(async (error) => {
  console.error('Indexer fatal error', error);
  if (redis.isOpen) {
    await redis.quit();
  }
  await prisma.$disconnect();
  process.exit(1);
});
