import 'dotenv/config';
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  Hex,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoSepolia } from 'viem/chains';

const readEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
};

const intentMeshAddress = (process.env.INTENT_MESH_ADDRESS ?? '0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b') as `0x${string}`;
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const x402Endpoint = readEnv('THIRDWEB_X402_ENDPOINT', 'X402_ENDPOINT');
const x402ApiKey = readEnv('THIRDWEB_X402_API_KEY', 'X402_API_KEY');
const requireX402 = (process.env.REQUIRE_X402 ?? 'true') === 'true';

if (!intentMeshAddress || !relayerPrivateKey) {
  throw new Error('Missing INTENT_MESH_ADDRESS or RELAYER_PRIVATE_KEY');
}

const intentMeshAbi = [
  {
    type: 'function',
    name: 'lockEscrow',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'intentId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'startExecution',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'intentId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'settle',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'intentId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'commitMerkleRoot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'intentId', type: 'uint256' },
      { name: 'merkleRoot', type: 'bytes32' },
      { name: 'step', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setCrossBorderRoute',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'intentId', type: 'uint256' },
      { name: 'sourceRegion', type: 'uint256' },
      { name: 'destinationRegion', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'openDispute',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'intentId', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setCrossBorderStablecoins',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'intentId', type: 'uint256' },
      { name: 'sourceStable', type: 'string' },
      { name: 'destinationStable', type: 'string' },
    ],
    outputs: [],
  },
] as const;

const account = privateKeyToAccount(relayerPrivateKey);

const publicClient = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.CELO_RPC_URL ?? 'https://forno.celo-sepolia.celo-testnet.org'),
});

const walletClient = createWalletClient({
  account,
  chain: celoSepolia,
  transport: http(process.env.CELO_RPC_URL ?? 'https://forno.celo-sepolia.celo-testnet.org'),
});

type RelayerAction = 'lockEscrow' | 'startExecution' | 'settle' | 'commitMerkleRoot' | 'setCrossBorderRoute' | 'setCrossBorderStablecoins' | 'openDispute';

async function submitMetaTransaction(functionName: RelayerAction, args: readonly unknown[]) {
  const data = encodeFunctionData({
    abi: intentMeshAbi,
    functionName,
    args: args as any,
  });

  if (x402Endpoint && x402ApiKey) {
    const response = await fetch(x402Endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': x402ApiKey,
      },
      body: JSON.stringify({
        chainId: celoSepolia.id,
        to: intentMeshAddress,
        functionName,
        intentId: String(args[0] ?? ''),
        data,
        fromAgent: account.address,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`x402 relay rejected request: ${text}`);
    }

    const x402Result = (await response.json().catch(() => ({}))) as {
      txHash?: Hex;
      transactionHash?: Hex;
      hash?: Hex;
    };

    const relayedTxHash = x402Result.txHash ?? x402Result.transactionHash ?? x402Result.hash;
    if (relayedTxHash) {
      return publicClient.waitForTransactionReceipt({ hash: relayedTxHash });
    }

    if (requireX402) {
      throw new Error('x402 relay response missing tx hash while REQUIRE_X402=true');
    }
  } else if (requireX402) {
    throw new Error('Missing X402_ENDPOINT or X402_API_KEY while REQUIRE_X402=true');
  }

  // Optional fallback for local development only.
  const txHash = await walletClient.writeContract({
    address: intentMeshAddress,
    abi: intentMeshAbi,
    functionName,
    args: args as any,
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  return receipt;
}

export async function lockEscrow(intentId: number) {
  return submitMetaTransaction('lockEscrow', [BigInt(intentId)]);
}

export async function startExecution(intentId: number) {
  return submitMetaTransaction('startExecution', [BigInt(intentId)]);
}

export async function settle(intentId: number) {
  return submitMetaTransaction('settle', [BigInt(intentId)]);
}

export async function commitMerkleRoot(intentId: number, merkleRoot: `0x${string}`, step: number) {
  return submitMetaTransaction('commitMerkleRoot', [BigInt(intentId), merkleRoot, BigInt(step)]);
}

export async function setCrossBorderRoute(intentId: number, sourceRegion: number, destinationRegion: number) {
  return submitMetaTransaction('setCrossBorderRoute', [BigInt(intentId), BigInt(sourceRegion), BigInt(destinationRegion)]);
}

export async function openDispute(intentId: number, reason: string) {
  return submitMetaTransaction('openDispute', [BigInt(intentId), reason]);
}

async function runCli() {
  const action = process.argv[2] as RelayerAction | undefined;
  const intentIdArg = process.argv[3];
  const arg1 = process.argv[4];
  const arg2 = process.argv[5];

  if (!action || !intentIdArg) {
    console.log('Usage: tsx relayer.ts <lockEscrow|startExecution|settle|commitMerkleRoot|setCrossBorderRoute|setCrossBorderStablecoins|openDispute> <intentId> [arg1] [arg2]');
    process.exit(0);
  }

  const intentId = Number(intentIdArg);
  if (Number.isNaN(intentId)) {
    throw new Error('intentId must be a number');
  }

  let args: readonly unknown[] = [BigInt(intentId)];
  if (action === 'commitMerkleRoot') {
    if (!arg1 || !arg2) throw new Error('commitMerkleRoot requires <merkleRoot> <step>');
    args = [BigInt(intentId), arg1 as `0x${string}`, BigInt(Number(arg2))];
  }
  if (action === 'setCrossBorderRoute') {
    if (!arg1 || !arg2) throw new Error('setCrossBorderRoute requires <sourceRegion> <destinationRegion>');
    args = [BigInt(intentId), BigInt(Number(arg1)), BigInt(Number(arg2))];
  }
  if (action === 'openDispute') {
    if (!arg1) throw new Error('openDispute requires <reason>');
    args = [BigInt(intentId), arg1];
  }
  if (action === 'setCrossBorderStablecoins') {
    if (!arg1 || !arg2) throw new Error('setCrossBorderStablecoins requires <sourceStable> <destinationStable>');
    args = [BigInt(intentId), arg1, arg2];
  }

  const receipt = await submitMetaTransaction(action, args);
  console.log(`${action} confirmed in tx ${receipt.transactionHash}`);
}

runCli().catch((error) => {
  console.error('Relayer failed', error);
  process.exit(1);
});
