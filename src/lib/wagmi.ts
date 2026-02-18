import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celoSepolia } from 'wagmi/chains';

const walletConnectProjectId = (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '').trim();

if (!walletConnectProjectId) {
    throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Set a valid Reown/WalletConnect project id in your environment.');
}

export const config = getDefaultConfig({
    appName: 'MeshForge v2',
    projectId: walletConnectProjectId,
    chains: [celoSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
