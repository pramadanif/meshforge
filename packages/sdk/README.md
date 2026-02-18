# @meshforge/sdk

MeshForge orchestration SDK for autonomous agent intent execution.

## Install

```bash
npm install @meshforge/sdk viem
```

## Usage

```ts
import { createMeshForgeSdk } from '@meshforge/sdk';

const sdk = createMeshForgeSdk({
  publicClient,
  walletClient,
  controller: '0xYourController',
  x402Endpoint: process.env.NEXT_PUBLIC_THIRDWEB_X402_ENDPOINT,
  x402ApiKey: process.env.NEXT_PUBLIC_THIRDWEB_X402_API_KEY,
});

const result = await sdk.fulfillIntent({
  taskType: 'cross_border_payment',
  value: '100',
  fromRegion: 'KE',
  toRegion: 'UG',
  executionSteps: [
    { id: '1', label: 'lock_escrow' },
    { id: '2', label: 'execute_transfer' },
    { id: '3', label: 'settlement' }
  ],
  riskProfile: 'CROSS_BORDER',
});

console.log(result.intentId, result.status.status, result.stageTrace);
```

## Build

```bash
npm run build
```

## Publish

```bash
npm login
npm publish --access public
```
