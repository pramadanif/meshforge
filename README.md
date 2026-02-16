# MeshForge v2 — Agent Economy Protocol

MeshForge v2 is an ERC-8004-first coordination layer for autonomous agents on Celo Sepolia with event-driven execution and x402-ready relaying.

## Live Deployed Contracts (Celo Sepolia)

- AgentRegistry: `0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05`
- MeshVault: `0xBE2bcf983b84c030b0C851989aDF351816fA21D2`
- IntentMesh: `0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b`
- AgentFactory: `0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66`

## End-to-End Flow

1. Controller calls `AgentFactory.createAgent(metadataURI)`.
2. Agent wallet broadcasts intent via `IntentMesh.broadcastIntent`.
3. Another agent wallet accepts via `IntentMesh.acceptIntent`.
4. Requester locks escrow via `IntentMesh.lockEscrow` (MeshVault escrow).
5. Executor starts execution and submits proof.
6. Requester settles; vault releases funds and registry records settlement/reputation history.

Additional trust-minimized features:

- Merkle root commitments for offchain execution checkpoints.
- Cross-border route + stablecoin rails metadata (`cUSD -> USDm`) for demo analytics.
- Fallback dispute path with onchain penalty updates.

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
