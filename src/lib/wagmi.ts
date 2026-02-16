import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celoSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'MeshForge v2',
    projectId: 'YOUR_PROJECT_ID', // TODO: Get a valid Project ID from WalletConnect
    chains: [celoSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
