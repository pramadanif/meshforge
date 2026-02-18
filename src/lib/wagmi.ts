import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celoSepolia } from 'wagmi/chains';

const walletConnectProjectId = (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '').trim();

export const config = getDefaultConfig({
    appName: 'MeshForge',
    projectId: walletConnectProjectId || '00000000000000000000000000000000',
    chains: [celoSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
