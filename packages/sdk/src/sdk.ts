import { decodeEventLog, encodeFunctionData, keccak256, parseEther, stringToHex } from 'viem';
import {
  AGENT_FACTORY_ABI,
  AGENT_FACTORY_ADDRESS,
  AGENT_WALLET_ABI,
  INTENT_MESH_ABI,
  INTENT_MESH_ADDRESS,
} from './contracts';

export interface MeshForgeSdk {
  getAgentWallet(controller: `0x${string}`): Promise<`0x${string}` | null>;
  createAgent(metadataURI: string): Promise<`0x${string}`>;
  executeTask(input: FulfillIntentInput): Promise<FulfillIntentResult>;
  fulfillIntent(input: FulfillIntentInput): Promise<FulfillIntentResult>;
  settleIntent(input: SettleIntentInput): Promise<ExecutionLifecycleResult>;
  getExecutionStatus(input: GetExecutionStatusInput): Promise<ExecutionStatus>;
  routeEconomicAction(input: EconomicRoutingInput): Promise<EconomicRoutePlan>;
  submitExecutionTrace(input: SubmitExecutionTraceInput): Promise<ExecutionTraceResult>;

  // Backward-compatible primitives (legacy surface)
  broadcastIntent(title: string, description: string, valueCusd: string): Promise<`0x${string}`>;
  acceptIntent(intentId: number): Promise<`0x${string}`>;
}

interface SdkConfig {
  publicClient: any;
  walletClient: any;
  controller: `0x${string}`;
  x402Endpoint?: string;
  x402ApiKey?: string;
  requireX402?: boolean;
  chainId?: number;
  defaultMetadataURI?: string;
  defaultTrustRequirements?: Partial<TrustRequirements>;
  autoAcceptIntent?: boolean;
}

export type ExecutionRiskProfile =
  | 'LOW_RISK'
  | 'HIGH_VALUE'
  | 'CROSS_BORDER'
  | 'REPUTATION_SENSITIVE';

export type OrchestrationStage =
  | 'IDENTITY_READY'
  | 'INTENT_BROADCASTED'
  | 'ROUTE_CONFIGURED'
  | 'ESCROW_LOCKED'
  | 'EXECUTION_STARTED'
  | 'TRACE_COMMITTED'
  | 'DISPUTE_OPENED'
  | 'SETTLED'
  | 'FAILED';

export interface ExecutionStepInput {
  id: string;
  label: string;
  payload?: string;
  timestamp?: number;
}

export interface TrustRequirements {
  requireMerkleProof: boolean;
  minReputationScore: number;
  maxExpectedLatencySeconds: number;
  allowAutoDispute: boolean;
}

export interface FulfillIntentInput {
  taskType: string;
  value: number | string;
  fromRegion: string;
  toRegion: string;
  route?: {
    sourceStable?: string;
    destinationStable?: string;
  };
  executionSteps: ExecutionStepInput[];
  riskProfile?: ExecutionRiskProfile;
  trustRequirements?: Partial<TrustRequirements>;
  metadataURI?: string;
  title?: string;
  description?: string;
  existingIntentId?: number;
}

export interface SettleIntentInput {
  intentId: number;
  riskProfile?: ExecutionRiskProfile;
  trustRequirements?: Partial<TrustRequirements>;
}

export interface GetExecutionStatusInput {
  intentId: number;
}

export interface EconomicRoutingInput {
  taskType: string;
  value: number;
  fromRegion: string;
  toRegion: string;
}

export interface SubmitExecutionTraceInput {
  intentId: number;
  executionSteps: ExecutionStepInput[];
  step?: number;
}

export interface EconomicRoutePlan {
  sourceRegionCode: number;
  destinationRegionCode: number;
  sourceStable: string;
  destinationStable: string;
  expectedLatencySeconds: number;
  feeOptimization: 'SPEED' | 'BALANCED' | 'LOW_FEE';
  routeType: 'LOCAL' | 'CROSS_BORDER';
}

export interface RiskPolicy {
  riskProfile: ExecutionRiskProfile;
  autoDisputeValueThreshold: number;
  requiredProofSteps: number;
  strictSettlementGate: boolean;
  anomalySensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ExecutionLifecycleResult {
  txHash: `0x${string}` | null;
  stage: OrchestrationStage;
}

export interface ExecutionTraceResult {
  merkleRoot: `0x${string}`;
  txHash: `0x${string}`;
}

export interface ExecutionStatus {
  intentId: number;
  statusCode: number;
  status:
    | 'BROADCASTED'
    | 'ACCEPTED'
    | 'ESCROW_LOCKED'
    | 'EXECUTION_STARTED'
    | 'PROOF_SUBMITTED'
    | 'SETTLED'
    | 'UNKNOWN';
  requester: `0x${string}`;
  executor: `0x${string}`;
  value: string;
  disputed: boolean;
  fallbackResolved: boolean;
  merkleRoot: `0x${string}`;
}

export interface FulfillIntentResult {
  intentId: number;
  agentWallet: `0x${string}`;
  routePlan: EconomicRoutePlan;
  riskPolicy: RiskPolicy;
  status: ExecutionStatus;
  stageTrace: OrchestrationStage[];
  relayed: boolean;
}

const REGION_CODES: Record<string, number> = {
  KE: 1,
  UG: 2,
  TZ: 3,
  NG: 4,
  PH: 5,
  GH: 6,
};

const STABLECOIN_RAILS: Record<string, { sourceStable: string; destinationStable: string }> = {
  'KE:UG': { sourceStable: 'cUSD', destinationStable: 'USDm' },
  'NG:PH': { sourceStable: 'USDm', destinationStable: 'PHPm' },
  'KE:TZ': { sourceStable: 'cUSD', destinationStable: 'TZSm' },
};

const STATUS_LABELS: Record<number, ExecutionStatus['status']> = {
  0: 'BROADCASTED',
  1: 'ACCEPTED',
  2: 'ESCROW_LOCKED',
  3: 'EXECUTION_STARTED',
  4: 'PROOF_SUBMITTED',
  5: 'SETTLED',
};

const readEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
};

export function createMeshForgeSdk(config: SdkConfig): MeshForgeSdk {
  const { publicClient, walletClient, controller } = config;
  const cfg = {
    x402Endpoint: readEnv(
      'NEXT_PUBLIC_THIRDWEB_X402_ENDPOINT',
      'NEXT_PUBLIC_X402_ENDPOINT',
      'THIRDWEB_X402_ENDPOINT',
      'X402_ENDPOINT'
    ),
    x402ApiKey: readEnv(
      'NEXT_PUBLIC_THIRDWEB_X402_API_KEY',
      'NEXT_PUBLIC_X402_API_KEY',
      'THIRDWEB_X402_API_KEY',
      'X402_API_KEY'
    ),
    requireX402: (process.env.REQUIRE_X402 ?? 'false') === 'true',
    chainId: 11142220,
    defaultMetadataURI: 'ipfs://meshforge-agent-default-metadata.json',
    defaultTrustRequirements: {
      requireMerkleProof: true,
      minReputationScore: 0,
      maxExpectedLatencySeconds: 600,
      allowAutoDispute: true,
    } satisfies Partial<TrustRequirements>,
    autoAcceptIntent: false,
    ...config,
  } as Required<Pick<SdkConfig, 'chainId'>> & SdkConfig;

  const normalizeValue = (value: number | string): number => {
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) throw new Error(`Invalid value: ${value}`);
    return parsed;
  };

  const mergeTrustRequirements = (input?: Partial<TrustRequirements>): TrustRequirements => ({
    requireMerkleProof: input?.requireMerkleProof ?? cfg.defaultTrustRequirements?.requireMerkleProof ?? true,
    minReputationScore: input?.minReputationScore ?? cfg.defaultTrustRequirements?.minReputationScore ?? 0,
    maxExpectedLatencySeconds: input?.maxExpectedLatencySeconds ?? cfg.defaultTrustRequirements?.maxExpectedLatencySeconds ?? 600,
    allowAutoDispute: input?.allowAutoDispute ?? cfg.defaultTrustRequirements?.allowAutoDispute ?? true,
  });

  const deriveRiskPolicy = (riskProfile: ExecutionRiskProfile, value: number): RiskPolicy => {
    if (riskProfile === 'HIGH_VALUE') {
      return {
        riskProfile,
        autoDisputeValueThreshold: Math.max(5, value * 0.8),
        requiredProofSteps: 4,
        strictSettlementGate: true,
        anomalySensitivity: 'HIGH',
      };
    }

    if (riskProfile === 'CROSS_BORDER') {
      return {
        riskProfile,
        autoDisputeValueThreshold: Math.max(3, value * 0.6),
        requiredProofSteps: 3,
        strictSettlementGate: true,
        anomalySensitivity: 'MEDIUM',
      };
    }

    if (riskProfile === 'REPUTATION_SENSITIVE') {
      return {
        riskProfile,
        autoDisputeValueThreshold: Math.max(2, value * 0.4),
        requiredProofSteps: 3,
        strictSettlementGate: true,
        anomalySensitivity: 'HIGH',
      };
    }

    return {
      riskProfile,
      autoDisputeValueThreshold: 10_000,
      requiredProofSteps: 2,
      strictSettlementGate: false,
      anomalySensitivity: 'LOW',
    };
  };

  const routeEngine = async (input: EconomicRoutingInput): Promise<EconomicRoutePlan> => {
    const sourceRegionCode = REGION_CODES[input.fromRegion] ?? 99;
    const destinationRegionCode = REGION_CODES[input.toRegion] ?? 99;
    const pair = STABLECOIN_RAILS[`${input.fromRegion}:${input.toRegion}`] ?? {
      sourceStable: 'cUSD',
      destinationStable: 'USDm',
    };

    const crossBorder = input.fromRegion !== input.toRegion;
    const expectedLatencySeconds = crossBorder
      ? Math.max(120, Math.round(35 + input.value * 2))
      : Math.max(45, Math.round(20 + input.value * 0.5));

    const feeOptimization = input.value > 100
      ? 'LOW_FEE'
      : crossBorder
        ? 'BALANCED'
        : 'SPEED';

    return {
      sourceRegionCode,
      destinationRegionCode,
      sourceStable: pair.sourceStable,
      destinationStable: pair.destinationStable,
      expectedLatencySeconds,
      feeOptimization,
      routeType: crossBorder ? 'CROSS_BORDER' : 'LOCAL',
    };
  };

  const maybeRelayAction = async (functionName: string, args: readonly unknown[], data: `0x${string}`): Promise<boolean> => {
    const endpoint = cfg.x402Endpoint;
    const apiKey = cfg.x402ApiKey;

    if (!endpoint || !apiKey) {
      if (cfg.requireX402) {
        throw new Error('x402 relay required but endpoint/api key are missing');
      }
      return false;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        chainId: cfg.chainId,
        to: INTENT_MESH_ADDRESS,
        functionName,
        args,
        data,
        fromAgent: controller,
        protocol: 'meshforge_orchestration_v2',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`x402 relay rejected orchestration request: ${text}`);
    }

    return true;
  };

  const ensureAgentIdentity = async (metadataURI?: string): Promise<`0x${string}`> => {
    const existing = await getAgentWallet(controller);
    if (existing) return existing;

    const txHash = await createAgent(metadataURI ?? cfg.defaultMetadataURI ?? 'ipfs://meshforge-agent-default-metadata.json');
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    const created = await getAgentWallet(controller);
    if (!created) {
      throw new Error('AgentWallet auto-deployment failed: wallet mapping still empty');
    }
    return created;
  };

  const executeIntent = async (
    functionName:
      | 'broadcastIntent'
      | 'acceptIntent'
      | 'lockEscrow'
      | 'startExecution'
      | 'submitProof'
      | 'commitMerkleRoot'
      | 'setCrossBorderRoute'
      | 'setCrossBorderStablecoins'
      | 'openDispute'
      | 'settle',
    args: readonly unknown[]
  ): Promise<{ txHash: `0x${string}`; relayed: boolean }> => {
    const agentWallet = await ensureAgentIdentity();

    const data = encodeFunctionData({
      abi: INTENT_MESH_ABI,
      functionName,
      args: args as any,
    });

    const relayed = await maybeRelayAction(functionName, args, data as `0x${string}`);

    const txHash = await walletClient.writeContract({
      account: controller,
      address: agentWallet,
      abi: AGENT_WALLET_ABI,
      functionName: 'execute',
      args: [INTENT_MESH_ADDRESS, data],
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });
    return { txHash, relayed };
  };

  const extractIntentIdFromReceipt = async (txHash: `0x${string}`, fallbackIntentId: number): Promise<number> => {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    for (const log of receipt.logs ?? []) {
      try {
        const decoded = decodeEventLog({
          abi: INTENT_MESH_ABI,
          data: log.data,
          topics: log.topics,
          strict: false,
        });

        if (decoded.eventName === 'IntentBroadcasted') {
          const args = decoded.args as { intentId?: bigint };
          if (args?.intentId !== undefined) {
            return Number(args.intentId);
          }
        }
      } catch {
        // ignore unrelated logs
      }
    }

    return fallbackIntentId;
  };

  const detectExecutionAnomaly = (
    input: FulfillIntentInput,
    trust: TrustRequirements,
    routePlan: EconomicRoutePlan,
    riskPolicy: RiskPolicy
  ): boolean => {
    const value = normalizeValue(input.value);
    const noTrace = input.executionSteps.length < riskPolicy.requiredProofSteps;
    const routeSlow = routePlan.expectedLatencySeconds > trust.maxExpectedLatencySeconds;
    const highValue = value >= riskPolicy.autoDisputeValueThreshold;

    if (riskPolicy.anomalySensitivity === 'HIGH') {
      return noTrace || routeSlow || highValue;
    }
    if (riskPolicy.anomalySensitivity === 'MEDIUM') {
      return noTrace || highValue;
    }
    return noTrace && highValue;
  };

  const deriveProofHashes = (intentId: number, routePlan: EconomicRoutePlan): { gpsHash: `0x${string}`; photoHash: `0x${string}` } => {
    const gpsHash = keccak256(stringToHex(`gps:${intentId}:${routePlan.sourceRegionCode}->${routePlan.destinationRegionCode}`));
    const photoHash = keccak256(stringToHex(`photo:${intentId}:${routePlan.sourceStable}->${routePlan.destinationStable}`));
    return { gpsHash, photoHash };
  };

  const buildMerkleRoot = (steps: ExecutionStepInput[]): `0x${string}` => {
    if (!steps.length) {
      return keccak256(stringToHex('meshforge-empty-trace'));
    }

    let nodes = steps.map((step, index) => {
      const content = `${index}:${step.id}:${step.label}:${step.payload ?? ''}:${step.timestamp ?? 0}`;
      return keccak256(stringToHex(content));
    });

    while (nodes.length > 1) {
      const next: `0x${string}`[] = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1] ?? nodes[i];
        const [a, b] = left <= right ? [left, right] : [right, left];
        next.push(keccak256(stringToHex(`${a}${b}`)));
      }
      nodes = next;
    }

    return nodes[0];
  };

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
    return walletClient.writeContract({
      account: controller,
      address: AGENT_FACTORY_ADDRESS,
      abi: AGENT_FACTORY_ABI,
      functionName: 'createAgent',
      args: [metadataURI],
    });
  }

  async function broadcastIntent(title: string, description: string, valueCusd: string): Promise<`0x${string}`> {
    const result = await executeIntent('broadcastIntent', [title, description, parseEther(valueCusd)]);
    return result.txHash;
  }

  async function acceptIntent(intentId: number): Promise<`0x${string}`> {
    const result = await executeIntent('acceptIntent', [BigInt(intentId)]);
    return result.txHash;
  }

  async function routeEconomicAction(input: EconomicRoutingInput): Promise<EconomicRoutePlan> {
    return routeEngine(input);
  }

  async function submitExecutionTrace(input: SubmitExecutionTraceInput): Promise<ExecutionTraceResult> {
    const merkleRoot = buildMerkleRoot(input.executionSteps);
    const result = await executeIntent('commitMerkleRoot', [BigInt(input.intentId), merkleRoot, BigInt(input.step ?? 3)]);
    return {
      merkleRoot,
      txHash: result.txHash,
    };
  }

  async function settleIntent(input: SettleIntentInput): Promise<ExecutionLifecycleResult> {
    const result = await executeIntent('settle', [BigInt(input.intentId)]);
    return {
      txHash: result.txHash,
      stage: 'SETTLED',
    };
  }

  async function getExecutionStatus(input: GetExecutionStatusInput): Promise<ExecutionStatus> {
    const intent = await publicClient.readContract({
      address: INTENT_MESH_ADDRESS,
      abi: INTENT_MESH_ABI,
      functionName: 'getIntent',
      args: [BigInt(input.intentId)],
    });

    const parsed = intent as {
      id: bigint;
      requester: `0x${string}`;
      executor: `0x${string}`;
      value: bigint;
      status: bigint;
      offchainMerkleRoot: `0x${string}`;
      disputed: boolean;
      fallbackResolved: boolean;
    };

    const statusCode = Number(parsed.status);
    return {
      intentId: Number(parsed.id),
      statusCode,
      status: STATUS_LABELS[statusCode] ?? 'UNKNOWN',
      requester: parsed.requester,
      executor: parsed.executor,
      value: parsed.value.toString(),
      disputed: parsed.disputed,
      fallbackResolved: parsed.fallbackResolved,
      merkleRoot: parsed.offchainMerkleRoot,
    };
  }

  async function fulfillIntent(input: FulfillIntentInput): Promise<FulfillIntentResult> {
    const stageTrace: OrchestrationStage[] = [];
    let relayed = false;

    const value = normalizeValue(input.value);
    const trustRequirements = mergeTrustRequirements(input.trustRequirements);
    const riskProfile = input.riskProfile
      ?? (input.fromRegion !== input.toRegion ? 'CROSS_BORDER' : value >= 5 ? 'HIGH_VALUE' : 'LOW_RISK');
    const riskPolicy = deriveRiskPolicy(riskProfile, value);

    const agentWallet = await ensureAgentIdentity(input.metadataURI);
    stageTrace.push('IDENTITY_READY');

    const routePlan = await routeEconomicAction({
      taskType: input.taskType,
      value,
      fromRegion: input.fromRegion,
      toRegion: input.toRegion,
    });

    const countBefore = await publicClient.readContract({
      address: INTENT_MESH_ADDRESS,
      abi: INTENT_MESH_ABI,
      functionName: 'intentCount',
    });

    let intentId: number;

    if (input.existingIntentId !== undefined) {
      intentId = input.existingIntentId;
    } else {
      const title = input.title ?? `Task: ${input.taskType}`;
      const description = input.description ?? JSON.stringify({
        taskType: input.taskType,
        fromRegion: input.fromRegion,
        toRegion: input.toRegion,
        trustRequirements,
      });

      const broadcastResult = await executeIntent('broadcastIntent', [title, description, parseEther(String(value))]);
      relayed = relayed || broadcastResult.relayed;
      stageTrace.push('INTENT_BROADCASTED');
      intentId = await extractIntentIdFromReceipt(broadcastResult.txHash, Number(countBefore));

      if (cfg.autoAcceptIntent) {
        const acceptResult = await executeIntent('acceptIntent', [BigInt(intentId)]);
        relayed = relayed || acceptResult.relayed;
      }
    }

    try {
      const routeTx = await executeIntent('setCrossBorderRoute', [
        BigInt(intentId),
        BigInt(routePlan.sourceRegionCode),
        BigInt(routePlan.destinationRegionCode),
      ]);
      relayed = relayed || routeTx.relayed;

      const stableSource = input.route?.sourceStable ?? routePlan.sourceStable;
      const stableDestination = input.route?.destinationStable ?? routePlan.destinationStable;
      const stableTx = await executeIntent('setCrossBorderStablecoins', [
        BigInt(intentId),
        stableSource,
        stableDestination,
      ]);
      relayed = relayed || stableTx.relayed;
    } catch {
      // Route metadata is best-effort if caller isn't one of the current participants.
    }
    stageTrace.push('ROUTE_CONFIGURED');

    let status = await getExecutionStatus({ intentId });

    if (status.status === 'BROADCASTED' && cfg.autoAcceptIntent) {
      try {
        const acceptTx = await executeIntent('acceptIntent', [BigInt(intentId)]);
        relayed = relayed || acceptTx.relayed;
        status = await getExecutionStatus({ intentId });
      } catch {
        // Accept can fail if caller is requester or not eligible executor.
      }
    }

    if (status.status === 'ACCEPTED') {
      try {
        const lockTx = await executeIntent('lockEscrow', [BigInt(intentId)]);
        relayed = relayed || lockTx.relayed;
        stageTrace.push('ESCROW_LOCKED');
        status = await getExecutionStatus({ intentId });
      } catch {
        // Lock escrow requires requester role.
      }
    }

    if (status.status === 'ESCROW_LOCKED') {
      try {
        const startTx = await executeIntent('startExecution', [BigInt(intentId)]);
        relayed = relayed || startTx.relayed;
        stageTrace.push('EXECUTION_STARTED');
        status = await getExecutionStatus({ intentId });
      } catch {
        // Start execution requires executor role.
      }
    }

    if (status.status === 'EXECUTION_STARTED') {
      try {
        const { gpsHash, photoHash } = deriveProofHashes(intentId, routePlan);
        const proofTx = await executeIntent('submitProof', [BigInt(intentId), gpsHash, photoHash]);
        relayed = relayed || proofTx.relayed;
        status = await getExecutionStatus({ intentId });
      } catch {
        // Submit proof requires executor role.
      }
    }

    if (trustRequirements.requireMerkleProof) {
      try {
        await submitExecutionTrace({
          intentId,
          executionSteps: input.executionSteps,
          step: 3,
        });
        stageTrace.push('TRACE_COMMITTED');
      } catch {
        // Trace commit may fail if caller is not participant.
      }
    }

    status = await getExecutionStatus({ intentId });
    const anomalous = trustRequirements.allowAutoDispute
      && detectExecutionAnomaly(input, trustRequirements, routePlan, riskPolicy);

    if (anomalous && status.status !== 'SETTLED') {
      try {
        await executeIntent('openDispute', [BigInt(intentId), `AUTO_DISPUTE:${riskPolicy.riskProfile}`]);
        stageTrace.push('DISPUTE_OPENED');
      } catch {
        // Dispute open requires participant role and eligible fallback conditions.
      }
    }

    status = await getExecutionStatus({ intentId });
    if (!anomalous && status.status === 'PROOF_SUBMITTED') {
      try {
        await settleIntent({ intentId, riskProfile: riskPolicy.riskProfile, trustRequirements });
        stageTrace.push('SETTLED');
      } catch {
        // Settle requires requester role and no unresolved dispute.
      }
    }

    status = await getExecutionStatus({ intentId });

    return {
      intentId,
      agentWallet,
      routePlan,
      riskPolicy,
      status,
      stageTrace,
      relayed,
    };
  }

  async function executeTask(input: FulfillIntentInput): Promise<FulfillIntentResult> {
    return fulfillIntent(input);
  }

  return {
    getAgentWallet,
    createAgent,
    executeTask,
    fulfillIntent,
    settleIntent,
    getExecutionStatus,
    routeEconomicAction,
    submitExecutionTrace,
    broadcastIntent,
    acceptIntent,
  };
}
