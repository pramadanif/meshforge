# @pram1616/meshforge-sdk

MeshForge orchestration SDK for autonomous agent intent execution.

## Install

```bash
npm install @pram1616/meshforge-sdk viem
```

## Requirements

- A `viem` `publicClient`
- A `viem` `walletClient` connected to the signer/controller account
- Deployed MeshForge contracts (SDK includes default addresses used by MeshForge app)

## Quick Start

```ts
import { createMeshForgeSdk } from '@pram1616/meshforge-sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { celoSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const walletClient = createWalletClient({
  chain: celoSepolia,
  transport: custom(window.ethereum),
});

const [controller] = await walletClient.getAddresses();

const sdk = createMeshForgeSdk({
  publicClient,
  walletClient,
  controller,
  x402Endpoint: process.env.NEXT_PUBLIC_THIRDWEB_X402_ENDPOINT,
  x402ApiKey: process.env.NEXT_PUBLIC_THIRDWEB_X402_API_KEY,
  requireX402: false,
  autoAcceptIntent: false,
});
```

## Main Usage (`fulfillIntent`)

```ts
import { createMeshForgeSdk } from '@pram1616/meshforge-sdk';

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

console.log({
  intentId: result.intentId,
  status: result.status.status,
  stageTrace: result.stageTrace,
  relayedByX402: result.relayed,
  route: result.routePlan,
});
```

## API Surface

- `createMeshForgeSdk(config)`
  - `config.publicClient`: viem public client
  - `config.walletClient`: viem wallet client
  - `config.controller`: signer/controller address (`0x...`)
  - `config.x402Endpoint?`: x402 relay endpoint
  - `config.x402ApiKey?`: x402 API key
  - `config.requireX402?`: when `true`, throws if x402 env/config is missing
  - `config.autoAcceptIntent?`: auto-run `acceptIntent` stage when possible

- `sdk.fulfillIntent(input)` / `sdk.executeTask(input)`
  - High-level orchestration flow: identity → broadcast → route metadata → escrow/execution/proof (best-effort by role) → trace commit → dispute/settlement logic

- `sdk.getExecutionStatus({ intentId })`
  - Returns status object with `statusCode`, `status`, `merkleRoot`, dispute flags, and actor addresses

- `sdk.submitExecutionTrace({ intentId, executionSteps, step? })`
  - Builds merkle root from step data and commits it on-chain

- `sdk.settleIntent({ intentId })`
  - Attempts to settle intent lifecycle

- Legacy primitives:
  - `sdk.broadcastIntent(title, description, valueCusd)`
  - `sdk.acceptIntent(intentId)`

## Input Reference

`FulfillIntentInput` important fields:

- `taskType: string`
- `value: number | string`
- `fromRegion: string` (e.g. `KE`)
- `toRegion: string` (e.g. `UG`)
- `executionSteps: { id, label, payload?, timestamp? }[]`
- Optional: `riskProfile`, `trustRequirements`, `route`, `metadataURI`, `title`, `description`, `existingIntentId`

## x402 Notes

- x402 relay is optional by default.
- If `requireX402: true`, SDK throws when endpoint/key are unavailable.
- Env fallback keys supported:
  - Endpoint: `NEXT_PUBLIC_THIRDWEB_X402_ENDPOINT`, `NEXT_PUBLIC_X402_ENDPOINT`, `THIRDWEB_X402_ENDPOINT`, `X402_ENDPOINT`
  - API key: `NEXT_PUBLIC_THIRDWEB_X402_API_KEY`, `NEXT_PUBLIC_X402_API_KEY`, `THIRDWEB_X402_API_KEY`, `X402_API_KEY`

## Build

```bash
npm run build
```

## Publish

```bash
npm login
npm publish --access public
```

## License

MIT
