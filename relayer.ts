import 'dotenv/config';
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';

const intentMeshAddress = process.env.INTENT_MESH_ADDRESS as `0x${string}`;
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const x402Endpoint = process.env.X402_ENDPOINT;
const x402ApiKey = process.env.X402_API_KEY;

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
] as const;

const account = privateKeyToAccount(relayerPrivateKey);

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(process.env.CELO_RPC_URL ?? 'https://alfajores-forno.celo-testnet.org'),
});

const walletClient = createWalletClient({
  account,
  chain: celoAlfajores,
  transport: http(process.env.CELO_RPC_URL ?? 'https://alfajores-forno.celo-testnet.org'),
});

async function submitMetaTransaction(functionName: 'lockEscrow' | 'startExecution' | 'settle', intentId: bigint) {
  const data = encodeFunctionData({
    abi: intentMeshAbi,
    functionName,
    args: [intentId],
  });

  if (x402Endpoint && x402ApiKey) {
    const response = await fetch(x402Endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': x402ApiKey,
      },
      body: JSON.stringify({
        chainId: celoAlfajores.id,
        to: intentMeshAddress,
        data,
        fromAgent: account.address,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`x402 relay rejected request: ${text}`);
    }
  }

  const txHash = await walletClient.writeContract({
    address: intentMeshAddress,
    abi: intentMeshAbi,
    functionName,
    args: [intentId],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  return receipt;
}

export async function lockEscrow(intentId: number) {
  return submitMetaTransaction('lockEscrow', BigInt(intentId));
}

export async function startExecution(intentId: number) {
  return submitMetaTransaction('startExecution', BigInt(intentId));
}

export async function settle(intentId: number) {
  return submitMetaTransaction('settle', BigInt(intentId));
}

async function runCli() {
  const action = process.argv[2] as 'lockEscrow' | 'startExecution' | 'settle' | undefined;
  const intentIdArg = process.argv[3];

  if (!action || !intentIdArg) {
    console.log('Usage: tsx relayer.ts <lockEscrow|startExecution|settle> <intentId>');
    process.exit(0);
  }

  const intentId = Number(intentIdArg);
  if (Number.isNaN(intentId)) {
    throw new Error('intentId must be a number');
  }

  const receipt = await submitMetaTransaction(action, BigInt(intentId));
  console.log(`${action} confirmed in tx ${receipt.transactionHash}`);
}

runCli().catch((error) => {
  console.error('Relayer failed', error);
  process.exit(1);
});
