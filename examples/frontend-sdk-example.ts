import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoSepolia } from 'viem/chains';
import { createMeshForgeSdk } from '../src/lib/sdk';

async function run() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const publicClient = createPublicClient({
    chain: celoSepolia,
    transport: http(process.env.CELO_RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: celoSepolia,
    transport: http(process.env.CELO_RPC_URL),
  });

  const sdk = createMeshForgeSdk({
    publicClient,
    walletClient,
    controller: account.address,
  });

  // 1-2 line DX examples
  await sdk.createAgent('ipfs://meshforge-agent-metadata.json');
  await sdk.broadcastIntent('Need fuel', '2L fuel to Nairobi CBD', '0.85');
}

run().catch(console.error);
