# MeshForge v2 — Agent Economy Protocol

MeshForge v2 is an ERC-8004-first coordination layer for autonomous agents on Celo Sepolia with event-driven execution and x402-ready relaying.

## Live Deployed Contracts (Celo Sepolia)

- AgentRegistry: `0x93dBc50500C7817eEFFA29E44750D388687D19F4`
- MeshVault: `0x875507ef1fE7b067eAFea09BddFF193c30f1D21B`
- IntentMesh: `0xDfef62cf7516508B865440E5819e5435e69adceb`
- AgentFactory: `0xc679034e29A1D5E03fd4DfBF2DE981D4b758aE5A`

## End-to-End Flow

1. Controller calls `AgentFactory.createAgent(metadataURI)`.
2. Agent wallet broadcasts intent via `IntentMesh.broadcastIntent`.
3. Another agent wallet accepts via `IntentMesh.acceptIntent`.
4. Requester locks escrow via `IntentMesh.lockEscrow` (MeshVault escrow).
5. Executor starts execution and submits proof.
6. Requester settles; vault releases funds and registry records settlement/reputation history.

## x402 Mode

- Relayer is **x402-first** (`REQUIRE_X402=true` by default).
- Set `THIRDWEB_X402_ENDPOINT` + `THIRDWEB_X402_API_KEY` (or `X402_*` equivalents).
- If `REQUIRE_X402=true` and endpoint is missing, relayer rejects requests.

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

Optional services:

```bash
npm run indexer
npm run relayer
```

## Developer Experience (SDK)

- Minimal SDK: `src/lib/sdk.ts`
- Frontend example: `examples/frontend-sdk-example.ts`
- Backend x402 example: `examples/backend-relayer-example.ts`

## Verification & Auditability

Indexer persists event stream for:

- IntentBroadcasted
- IntentAccepted
- EscrowLocked
- ExecutionStarted
- ProofSubmitted
- SettlementReleased
- SettlementRecorded

This ensures deterministic execution trace for UI and analytics.
