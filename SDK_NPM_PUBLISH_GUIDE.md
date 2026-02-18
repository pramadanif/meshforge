# MeshForge SDK — NPM Publish Guide

## 1) Package structure recommendation

Create a dedicated package folder (recommended):

- `packages/sdk/src/index.ts` (export public SDK API)
- `packages/sdk/src/sdk.ts` (copy/refactor from app SDK)
- `packages/sdk/package.json`
- `packages/sdk/tsconfig.json`
- `packages/sdk/README.md`

Current SDK source in app:
- `src/lib/sdk.ts`

## 2) Minimal package.json (example)

```json
{
  "name": "@meshforge/sdk",
  "version": "1.0.0",
  "description": "MeshForge orchestration SDK for autonomous agent intent execution",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "license": "MIT",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "viem": "^2.46.0"
  },
  "dependencies": {}
}
```

## 3) Public API to expose

Expose only stable, high-level API:

- `createMeshForgeSdk(config)`
- `sdk.fulfillIntent(input)`
- `sdk.executeTask(input)`
- `sdk.routeEconomicAction(input)`
- `sdk.getExecutionStatus(input)`

Keep internal engines private:

- risk derivation
- anomaly detection
- merkle construction
- relay internals

## 4) Agent usage example

```ts
import { createMeshForgeSdk } from "@meshforge/sdk";

const sdk = createMeshForgeSdk({
  publicClient,
  walletClient,
  controller: "0xYourController",
  x402Endpoint: process.env.NEXT_PUBLIC_X402_ENDPOINT,
  x402ApiKey: process.env.NEXT_PUBLIC_X402_API_KEY,
});

const result = await sdk.fulfillIntent({
  taskType: "cross_border_payment",
  value: "100",
  fromRegion: "KE",
  toRegion: "UG",
  executionSteps: [
    { id: "1", label: "lock_escrow" },
    { id: "2", label: "execute_transfer" },
    { id: "3", label: "settlement" }
  ],
  riskProfile: "CROSS_BORDER",
});

console.log(result.intentId, result.status.status, result.stageTrace);
```

## 5) Publish commands

```bash
npm login
npm run build
npm publish --access public
```

For scoped packages (recommended):

```bash
npm publish --access public
```

## 6) Semver + release workflow

- patch: bugfix internal behavior
- minor: additive APIs / new risk profiles
- major: breaking type/API changes

Recommended:

```bash
npm version patch
npm publish
```

## 7) Security checklist before publish

- remove app-specific env assumptions
- remove private endpoints/secrets
- validate no hardcoded API keys
- add strict TypeScript exports
- add README with supported chains and required contracts

## 8) Where to upload SDK?

- Primary distribution: npm registry (`@meshforge/sdk`)
- Source of truth: GitHub repository tag/releases
- Optional docs hosting: docs site + typedoc
