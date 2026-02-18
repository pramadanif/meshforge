# MeshForge v2 — Live Demo Guide (English, Click-by-Click)

This guide is written for live judging. It tells you exactly what to click, what to say, and what commands to run.

## Demo Goal

Show that MeshForge is a **real infra protocol layer** with:
- onchain execution lifecycle,
- indexed observability,
- x402 payment-gated resources,
- multi-agent coordination UX.

---

## 0) Pre-Demo Setup (5 minutes before judges)

## Terminal A — API/backend health
```bash
cd /var/www/meshforge-next
pm2 status
pm2 logs meshforge-api --lines 30
pm2 logs meshforge-indexer --lines 30
```

Expected:
- `meshforge-api` online
- `meshforge-indexer` online

## Terminal B — Public API checks
```bash
curl -i https://api.meshforge.tech/api/activity
curl -i https://api.meshforge.tech/api/agents
curl -i https://api.meshforge.tech/api/metrics
curl -i https://api.meshforge.tech/api/trust-graph
```

Expected: HTTP `200`.

## Terminal C — x402 premium gate check
```bash
curl -i https://api.meshforge.tech/api/x402/premium-content
curl -i 'https://api.meshforge.tech/api/agents?premium=1'
```

Expected (without payment header): HTTP `402 Payment Required`.

---

## 1) Open the Frontend

1. Open your Vercel URL in browser.
2. Click **Launch App**.
3. Connect wallet (Celo Sepolia account).

Say:
> “The frontend is hosted on Vercel and reads live data from `api.meshforge.tech`. No local mock data is used.”

---

## 2) Show Real-Time Infra Observability (Dashboard)

Page: `/dashboard`

## What to click
1. Scroll through **Metrics**, **Cross-Border Metrics**, **Trust Graph**, **Live Activity**.
2. Keep this page open in one tab for real-time updates.

## What to say
> “These panels are fed by indexed onchain lifecycle events in Postgres, not static fixtures.”

---

## 3) Trigger an Intent Lifecycle

Page: `/intents`

## What to click
1. Click **Create Intent**.
2. Fill minimum required fields and submit.
3. Confirm wallet transaction.

Then page: `/execution` and open a tracked intent.

## What to click in execution detail
1. Click **Lock + Start Execution**.
2. Click **Commit Merkle**.
3. Click **Settle**.

Each click should open/confirm wallet tx.

## What to say
> “This is the end-to-end intent state machine: escrow, execution start, proof commit, and settlement.”

---

## 4) Show Proof of Onchain + Indexed Sync

After executing steps above:

## In browser
1. Go back to `/dashboard`.
2. Check **Live Activity** and **Metrics** changed.

## In terminal
```bash
curl -s https://api.meshforge.tech/api/activity | head -c 400
curl -s https://api.meshforge.tech/api/metrics | head -c 400
curl -s https://api.meshforge.tech/api/trust-graph | head -c 400
```

## What to say
> “We can verify the same lifecycle from API outputs, because indexer persists every relevant contract event.”

---

## 5) Show x402 Payment Gating

## In terminal
```bash
curl -i https://api.meshforge.tech/api/x402/premium-content
```

Expected:
- `HTTP/1.1 402 Payment Required`
- `payment-required` header present.

## What to say
> “Premium infra resources are payment-gated via x402. Without payment proof, access is denied by design.”

---

## 6) Show Agent-Centric UX

Page sequence:
1. `/agents` (directory from live API)
2. `/agents/:id` (agent profile + reputation/activity)
3. `/chat` (conversation threads derived from execution logs)

## What to say
> “Independent agents can coordinate through shared intent memory, settlement rails, and portable trust signals.”

---

## 7) Optional Advanced Segment (if judges ask)

## Relayer CLI demo (on server)
```bash
cd /var/www/meshforge-next
npm run relayer -- lockEscrow <intentId>
npm run relayer -- startExecution <intentId>
npm run relayer -- settle <intentId>
```

## SDK snippet (show in editor)
```ts
import { createMeshForgeSdk } from '@meshforge/sdk';

const sdk = createMeshForgeSdk({ publicClient, walletClient, controller });

const result = await sdk.fulfillIntent({
  taskType: 'cross_border_payment',
  value: '100',
  fromRegion: 'KE',
  toRegion: 'UG',
  executionSteps: [
    { id: '1', label: 'lock_escrow' },
    { id: '2', label: 'execute_transfer' },
    { id: '3', label: 'settlement' },
  ],
  riskProfile: 'CROSS_BORDER',
});
```

---

## 8) Judge Q&A Mapping (Quick Answers)

## Technical Innovation
- “Onchain lifecycle + Merkle commit + x402-gated infra endpoints.”

## Developer Experience
- “Single SDK entrypoint + consistent API routes + deployable FE/VPS split.”

## Security & Trust Minimization
- “Auditable event trail, payment-gated access, dispute lifecycle, clear key separation.”

## Real-World Applicability
- “Cross-border metrics and settlement flow targeting informal economies (Africa + SEA).”

---

## 9) Backup Plan (if network is unstable)

1. Show pre-generated API responses:
```bash
curl -s https://api.meshforge.tech/api/activity
curl -s https://api.meshforge.tech/api/metrics
curl -s https://api.meshforge.tech/api/trust-graph
```
2. Show PM2 logs proving indexer + API uptime:
```bash
pm2 logs meshforge-api --lines 80
pm2 logs meshforge-indexer --lines 80
```
3. Show recent tx hash in explorer and map it to API activity item.

---

You can also pair this with your narrative in `MASTER_SUBMISSION.md` for a complete judge-facing package.
