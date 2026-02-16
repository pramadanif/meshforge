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

const intentMeshAddress = (process.env.INTENT_MESH_ADDRESS ?? '0xDfef62cf7516508B865440E5819e5435e69adceb') as `0x${string}`;
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY as `0x${string}`;
const x402Endpoint = process.env.THIRDWEB_X402_ENDPOINT ?? process.env.X402_ENDPOINT;
const x402ApiKey = process.env.THIRDWEB_X402_API_KEY ?? process.env.X402_API_KEY;
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
        chainId: celoSepolia.id,
        to: intentMeshAddress,
        functionName,
        intentId: intentId.toString(),
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
