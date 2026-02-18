# MeshForge v2 — End-to-End Demo Guide

Panduan ini fokus ke **apa yang perlu didemokan**, **alur kode end-to-end**, dan **cara mapping ke kriteria judging infra**.

## 1) Tujuan Demo (untuk Judge)

Tunjukkan bahwa MeshForge v2 adalah **infra layer** yang sudah bekerja end-to-end:

1. Agent lifecycle berjalan on-chain (`broadcast -> accept -> escrow -> execute -> proof -> settle`)
2. Event lifecycle terindex ke PostgreSQL (via indexer)
3. API analytics/trust graph membaca data real dari indexer
4. Frontend menampilkan data live dari backend API domain (`api.meshforge.tech`)
5. x402 payment-gated resource mengembalikan `402 Payment Required` saat belum bayar

---

## 2) Arsitektur Flow yang Didemokan

## On-chain layer
- Contracts utama:
  - `IntentMesh`
  - `AgentRegistry`
  - `MeshVault`
  - `AgentFactory`
- Integrasi frontend hooks: `src/hooks/useMeshForge.ts`

## Off-chain infra
- Indexer watcher: `indexer.ts`
  - Watch event `IntentBroadcasted`, `IntentAccepted`, `EscrowLocked`, `ExecutionStarted`, `ProofSubmitted`, `MerkleRootCommitted`, `DisputeOpened`, `DisputeResolved`, `SettlementReleased`, `SettlementRecorded`, `ReputationPenalized`
- Storage:
  - PostgreSQL (Prisma models `executionLog`, `intentExecutionState`, `agentReputation`)
  - Redis cache (`agent:<id>:reputation`)

## API analytics
- `GET /api/activity`
- `GET /api/agents`
- `GET /api/chat`
- `GET /api/metrics`
- `GET /api/trust-graph`
- x402 premium:
  - `GET /api/x402/premium-content`
  - `GET /api/agents?premium=1`

## Frontend pages
- Dashboard: metrics + trust graph + activity
- Agents: list + detail from API
- Chat: conversation from execution logs
- Execution Hub + Execution Detail: lifecycle tracking + controls

---

## 3) Pre-Demo Checklist (WAJIB)

1. Backend API di VPS running:
```bash
pm2 status
```
Harus ada minimal:
- `meshforge-api` online
- `meshforge-indexer` online

2. Endpoint health check:
```bash
curl -s https://api.meshforge.tech/api/activity | head -c 200
curl -s https://api.meshforge.tech/api/agents | head -c 200
curl -s https://api.meshforge.tech/api/metrics | head -c 200
curl -s https://api.meshforge.tech/api/trust-graph | head -c 200
```

3. x402 gate check:
```bash
curl -i https://api.meshforge.tech/api/x402/premium-content
curl -i 'https://api.meshforge.tech/api/agents?premium=1'
```
Expected tanpa payment header:
- `HTTP/1.1 402 Payment Required`

4. Frontend env di Vercel sudah pointing ke API:
- `NEXT_PUBLIC_API_BASE_URL=https://api.meshforge.tech`

5. Wallet demo sudah siap (Celo Sepolia test funds ada).

---

## 4) Script Demo 7–10 Menit (Recommended)

## Scene A — Infra framing (1 menit)
Tunjukkan cepat bahwa ini bukan app-only:
- Buka dashboard FE (Vercel)
- Jelaskan data source: FE -> `api.meshforge.tech` -> Postgres (indexer) -> on-chain events

## Scene B — Broadcast & lifecycle trigger (2 menit)
1. Buka halaman intents/execution
2. Broadcast atau pilih intent aktif
3. Jalankan step dari execution controls (`Lock + Start Execution`, `Commit Merkle`, `Settle`)
4. Tunjukkan tx di explorer

Yang divalidasi judge:
- lifecycle bukan mock
- state berubah dari event on-chain

## Scene C — Observability real-time (2 menit)
1. Buka dashboard page
2. Tunjukkan:
   - `Live Activity`
   - `Cross-Border Metrics`
   - `Trust Graph`
3. Refresh/polling memperlihatkan data terbaru setelah tx

Yang divalidasi judge:
- auditable flow
- indexer benar-benar memproses event

## Scene D — x402 trust-minimized payment gate (1 menit)
1. Run curl endpoint premium tanpa `x-payment`
2. Tunjukkan response `402 Payment Required`

Yang divalidasi judge:
- resource bisa payment-gated
- economics infra siap untuk agent monetization

## Scene E — Cross-agent interoperability (2 menit)
1. Tunjukkan agents list + detail page + chat page
2. Jelaskan semuanya dibangun dari execution logs (bukan hardcoded)

Yang divalidasi judge:
- shared coordination layer untuk multiple agents
- portable observability across modules

---

## 5) End-to-End Flow Mapping (Kode -> Runtime)

1. **User/Agent action**
   - Trigger dari UI / SDK / relayer
2. **On-chain execution**
   - call ke `IntentMesh` via `AgentWallet.execute` (`useMeshForge` atau SDK)
3. **Event emitted**
   - `IntentBroadcasted` ... `SettlementReleased`
4. **Indexer consume event**
   - `indexer.ts` watch event dan persist ke `executionLog`
5. **API aggregate**
   - route `src/app/api/*` hit Postgres (Prisma)
6. **Frontend render live**
   - komponen dashboard/agents/chat fetch ke `api.meshforge.tech`
7. **Premium resources (x402)**
   - route premium lewat `src/lib/x402.ts` + `settlePayment`

---

## 6) Fitur yang Wajib Didemokan (Prioritas)

## P0 (harus muncul)
- On-chain lifecycle (minimal 1 intent sampai settle atau proof)
- Activity feed terupdate dari event indexed
- Metrics API dan trust graph API hidup
- x402 premium endpoint `402` tanpa payment

## P1 (sangat dianjurkan)
- Dispute path (`openDispute`) untuk menunjukkan trust minimization fallback
- Cross-border metadata (`setCrossBorderRoute`, `setCrossBorderStablecoins`)

## P2 (opsional jika waktu)
- SDK usage snippet (`createMeshForgeSdk().fulfillIntent(...)`)
- relayer CLI action demo

---

## 7) Mapping ke Kriteria Judging

## Technical Innovation
- Intent lifecycle + Merkle commit + dispute + cross-border metadata
- x402 payment-gated resource

## Developer Experience
- FE consume 1 base URL API (`NEXT_PUBLIC_API_BASE_URL`)
- SDK package tersedia di `packages/sdk`
- API shape konsisten untuk dashboard/agents/chat

## Security & Trust Minimization
- Lifecycle event auditability on-chain
- Indexer persistence untuk forensic trail
- x402 payment gate + server-side secret handling
- Dispute + penalty signal di trust graph

## Real-World Applicability
- Celo Sepolia live deployment
- Cross-border metrics model (latency, fee, volume)
- Ready deploy topology: Vercel FE + VPS API

---

## 8) Demo Backup Plan (kalau testnet lambat)

1. Tunjukkan endpoint snapshot:
```bash
curl -s https://api.meshforge.tech/api/activity
curl -s https://api.meshforge.tech/api/metrics
curl -s https://api.meshforge.tech/api/trust-graph
```
2. Tunjukkan PM2 logs:
```bash
pm2 logs meshforge-indexer --lines 80
```
3. Tunjukkan satu tx hash sebelumnya di explorer + cocokkan dengan record API.

---

## 9) Quick Command Pack

```bash
# API health
curl -i https://api.meshforge.tech/api/activity
curl -i https://api.meshforge.tech/api/agents
curl -i https://api.meshforge.tech/api/metrics
curl -i https://api.meshforge.tech/api/trust-graph

# x402 premium
curl -i https://api.meshforge.tech/api/x402/premium-content
curl -i 'https://api.meshforge.tech/api/agents?premium=1'

# VPS ops
pm2 status
pm2 logs meshforge-api --lines 100
pm2 logs meshforge-indexer --lines 100
```

---

Jika kamu mau, next step saya bisa bikin **DEMO_RUNBOOK_5MIN.md** versi super ringkas (script ngomong + klik halaman per detik) khusus buat hari presentasi.
