import 'dotenv/config';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { celoSepolia } from 'viem/chains';
import { createClient as createRedisClient } from 'redis';
import { prisma } from './src/lib/prisma';

const intentMeshAddress = (process.env.INTENT_MESH_ADDRESS ?? '0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b') as `0x${string}`;
const agentRegistryAddress = (process.env.AGENT_REGISTRY_ADDRESS ?? '0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05') as `0x${string}`;

if (!intentMeshAddress || !agentRegistryAddress) {
  throw new Error('Missing INTENT_MESH_ADDRESS or AGENT_REGISTRY_ADDRESS');
}

const client = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.CELO_RPC_URL ?? 'https://forno.celo-sepolia.celo-testnet.org'),
});

const redis = createRedisClient({ url: process.env.REDIS_URL });

const events = {
  IntentBroadcasted: parseAbiItem('event IntentBroadcasted(uint256 indexed intentId, uint256 indexed requesterAgentId, address requester, string title, uint256 value)'),
  IntentAccepted: parseAbiItem('event IntentAccepted(uint256 indexed intentId, uint256 indexed executorAgentId, address indexed executor)'),
  EscrowLocked: parseAbiItem('event EscrowLocked(uint256 indexed intentId, uint256 amount)'),
  ExecutionStarted: parseAbiItem('event ExecutionStarted(uint256 indexed intentId)'),
  ProofSubmitted: parseAbiItem('event ProofSubmitted(uint256 indexed intentId, bytes32 gpsHash, bytes32 photoHash)'),
  MerkleRootCommitted: parseAbiItem('event MerkleRootCommitted(uint256 indexed intentId, bytes32 merkleRoot, uint256 indexed step)'),
  OffchainStepVerified: parseAbiItem('event OffchainStepVerified(uint256 indexed intentId, bytes32 leaf, uint256 indexed step, bool valid)'),
  DisputeOpened: parseAbiItem('event DisputeOpened(uint256 indexed intentId, uint256 indexed challengerAgentId, uint256 amount, string reason)'),
  DisputeResolved: parseAbiItem('event DisputeResolved(uint256 indexed intentId, bool approved, uint256 penaltyPoints, string evidenceRef)'),
  CrossBorderRouteSet: parseAbiItem('event CrossBorderRouteSet(uint256 indexed intentId, uint256 indexed sourceRegion, uint256 indexed destinationRegion)'),
  CrossBorderStablecoinsSet: parseAbiItem('event CrossBorderStablecoinsSet(uint256 indexed intentId, string sourceStable, string destinationStable)'),
  SettlementReleased: parseAbiItem('event SettlementReleased(uint256 indexed intentId, uint256 amount, uint256 indexed executorAgentId)'),
  SettlementRecorded: parseAbiItem('event SettlementRecorded(uint256 indexed intentId, uint256 indexed agentId, uint256 value, uint256 timestamp)'),
  ReputationPenalized: parseAbiItem('event ReputationPenalized(uint256 indexed agentId, uint256 penaltyPoints, string reason)'),
} as const;

type Lifecycle =
  | 'BROADCASTED'
  | 'ACCEPTED'
  | 'ESCROW_LOCKED'
  | 'EXECUTION_STARTED'
  | 'PROOF_SUBMITTED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
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
    event: events.IntentBroadcasted,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; requesterAgentId: bigint; requester: `0x${string}`; title: string; value: bigint };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'BROADCASTED', log.transactionHash);
        await persistExecutionLog('IntentBroadcasted', intentId, {
          requesterAgentId: Number(args.requesterAgentId),
          requester: args.requester,
          title: args.title,
          value: args.value.toString(),
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

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
    event: events.MerkleRootCommitted,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; merkleRoot: `0x${string}`; step: bigint };
        const intentId = Number(args.intentId);
        await persistExecutionLog('MerkleRootCommitted', intentId, {
          merkleRoot: args.merkleRoot,
          step: Number(args.step),
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.OffchainStepVerified,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; leaf: `0x${string}`; step: bigint; valid: boolean };
        const intentId = Number(args.intentId);
        await persistExecutionLog('OffchainStepVerified', intentId, {
          leaf: args.leaf,
          step: Number(args.step),
          valid: args.valid,
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.CrossBorderRouteSet,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; sourceRegion: bigint; destinationRegion: bigint };
        const intentId = Number(args.intentId);
        await persistExecutionLog('CrossBorderRouteSet', intentId, {
          sourceRegion: Number(args.sourceRegion),
          destinationRegion: Number(args.destinationRegion),
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.CrossBorderStablecoinsSet,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; sourceStable: string; destinationStable: string };
        const intentId = Number(args.intentId);
        await persistExecutionLog('CrossBorderStablecoinsSet', intentId, {
          sourceStable: args.sourceStable,
          destinationStable: args.destinationStable,
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.DisputeOpened,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; challengerAgentId: bigint; amount: bigint; reason: string };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'DISPUTE_OPENED', log.transactionHash);
        await persistExecutionLog('DisputeOpened', intentId, {
          challengerAgentId: Number(args.challengerAgentId),
          amount: args.amount.toString(),
          reason: args.reason,
        }, log.transactionHash, log.blockNumber, log.logIndex);
      }
    },
  });

  client.watchEvent({
    address: intentMeshAddress,
    event: events.DisputeResolved,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { intentId: bigint; approved: boolean; penaltyPoints: bigint; evidenceRef: string };
        const intentId = Number(args.intentId);
        await upsertIntentExecutionState(intentId, 'DISPUTE_RESOLVED', log.transactionHash);
        await persistExecutionLog('DisputeResolved', intentId, {
          approved: args.approved,
          penaltyPoints: Number(args.penaltyPoints),
          evidenceRef: args.evidenceRef,
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

  client.watchEvent({
    address: agentRegistryAddress,
    event: events.ReputationPenalized,
    onLogs: async (logs) => {
      for (const log of logs) {
        const args = log.args as { agentId: bigint; penaltyPoints: bigint; reason: string };
        await persistExecutionLog('ReputationPenalized', 0, {
          agentId: Number(args.agentId),
          penaltyPoints: Number(args.penaltyPoints),
          reason: args.reason,
        }, log.transactionHash, log.blockNumber, log.logIndex);
        await upsertAgentReputation(Number(args.agentId));
      }
    },
  });

  console.log('Indexer started: watching full lifecycle + Merkle + dispute + cross-border + reputation events');
}

main().catch(async (error) => {
  console.error('Indexer fatal error', error);
  if (redis.isOpen) {
    await redis.quit();
  }
  await prisma.$disconnect();
  process.exit(1);
});
