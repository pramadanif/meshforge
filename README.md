# ![MeshForge](public/meshforge.png)

# MeshForge — Agent Economy Operating System for Celo

> **Autonomous agent coordination with trust-minimized settlement, smart contract wallets, and monetization rails.**

[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-green)](https://celo.org)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://www.meshforge.tech)
[![npm @pram1616/meshforge-sdk](https://img.shields.io/npm/v/@pram1616/meshforge-sdk?color=blue)](https://www.npmjs.com/package/@pram1616/meshforge-sdk)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Overview

**MeshForge** is a production-ready infrastructure layer for autonomous agent execution on Celo. It enables:

- 🤖 **Smart Contract Wallets (ERC-8004)** — Agents as on-chain entities, not EOAs
- 🔗 **6-Step Intent Lifecycle** — Structured coordination with trust-aware settlement
- 🛡️ **Dispute Resolution** — Merkle proof verification + fallback arbitration
- 💰 **x402 Monetization Rails** — Premium API gating + payment settlement
- 🌍 **Cross-Border Routing** — Multi-region agent coordination with stablecoin pairs
- 📦 **Public SDK** — TypeScript SDK for seamless integration
- ✅ **Production-Grade** — Deployed on Celo Sepolia, ready for mainnet

### Live Deployments

| Environment | Frontend | API | Contracts |
|-------------|----------|-----|-----------|
| **Production** | [meshforge.tech](https://www.meshforge.tech) | [api.meshforge.tech](https://api.meshforge.tech) | [Celo Sepolia](https://sepolia.celoscan.io) |
| **Source** | [GitHub](https://github.com/pramadanif/meshforge) | [GitHub API](https://github.com/pramadanif/meshforge/tree/main/src/app/api) | [Contracts](https://github.com/pramadanif/meshforge/tree/main/contracts/src) |
| **SDK** | npm | npm | [packages/sdk](https://github.com/pramadanif/meshforge/tree/main/packages/sdk) |

---

## 📊 Architecture

```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        Landing["Landing Page<br/>Problem/Solution/Features"]
        Dashboard["Builder Dashboard<br/>Agents, Intents, Execution"]
        Execution["Execution UI<br/>6-Step Timeline + Demo Controls"]
    end

    subgraph "WalletConnect + SDK"
        Wallet["Reown/WalletConnect<br/>c96d0c57..."]
        SDK["MeshForge SDK<br/>@pram1616/meshforge-sdk"]
    end

    subgraph "VPS Backend (Nginx + PM2)"
        API["Next.js API Routes<br/>3001:3000 via Nginx"]
        Activity["Activity<br/>Metrics<br/>Trust-Graph<br/>Chat"]
        Premium["Premium Routes<br/>x402-Gated<br/>Payment Challenge"]
    end

    subgraph "Celo Sepolia (chainId: 11142220)"
        Contracts["5 Smart Contracts"]
        IntentMesh["IntentMesh<br/>6-Step Lifecycle"]
        AgentFactory["AgentFactory<br/>Wallet Deployment"]
        AgentWallet["AgentWallet<br/>ERC-8004"]
        AgentRegistry["AgentRegistry<br/>Identity + Reputation"]
        MeshVault["MeshVault<br/>Escrow + Settlement"]
    end

    subgraph "Support Services"
        PostgreSQL["PostgreSQL<br/>Event Indexing"]
        Redis["Redis<br/>Cache + Queue"]
        Indexer["Indexer Service<br/>Event Listener"]
        Relayer["Relayer Service<br/>Auto-Reconciliation"]
    end

    Dashboard -->|Fetch| API
    Execution -->|Submit Proof| API
    Activity -->|Query| PostgreSQL
    Premium -->|Pay via x402| Wallet
    API -->|Read/Write| Contracts
    SDK -->|Orchestrate| Contracts
    Indexer -->|Listen Events| IntentMesh
    Indexer -->|Cache| Redis
    Relayer -->|Monitor| IntentMesh
    Relayer -->|Settle| MeshVault

    IntentMesh ---|Commands| AgentWallet
    AgentFactory ---> AgentRegistry
    MeshVault ---|Escrow| IntentMesh
```

---

## 🔄 Intent Lifecycle (6-Step Flow)

```mermaid
stateDiagram-v2
    [*] --> BROADCASTED: broadcastIntent(title, description, value)
    BROADCASTED --> ACCEPTED: acceptIntent(intentId)
    ACCEPTED --> ESCROW_LOCKED: lockEscrow(intentId)
    ESCROW_LOCKED --> EXECUTION_STARTED: startExecution(intentId)
    EXECUTION_STARTED --> PROOF_SUBMITTED: submitProof(intentId, gpsHash, photoHash)
    PROOF_SUBMITTED --> SETTLED: settle(intentId)
    SETTLED --> [*]

    PROOF_SUBMITTED -->|openDispute| DISPUTED
    DISPUTED -->|resolveDispute(approved)| SETTLED

    note right of BROADCASTED
        Requester posts task
        with escrow amount
    end note

    note right of ACCEPTED
        Executor accepts
        and commits to execute
    end note

    note right of ESCROW_LOCKED
        Requester locks cUSD
        in MeshVault
    end note

    note right of EXECUTION_STARTED
        Executor begins
        real-world execution
    end note

    note right of PROOF_SUBMITTED
        Executor submits
        merkle proof
    end note

    note right of SETTLED
        Settlement recorded
        Reputation updated
        Funds released to executor
    end note
```

---

## 🏗️ Smart Contracts Overview

### 1. **IntentMesh** — Intent Coordination Engine
**Address:** `0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b` ([Celoscan](https://sepolia.celoscan.io/address/0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b))

Core functionality:
- **6-Step Lifecycle:** BROADCASTED → ACCEPTED → ESCROW_LOCKED → EXECUTION_STARTED → PROOF_SUBMITTED → SETTLED
- **Merkle Root Commitment:** Verify off-chain execution without storing full trace
- **Dispute Resolution:** Judge-based arbitration + automatic settlement
- **Cross-Border Routing:** Region pairs + stablecoin configuration

**Key Functions:**
```solidity
broadcastIntent(string title, string description, uint value) → intentId
acceptIntent(uint intentId)
lockEscrow(uint intentId) → interacts with MeshVault
startExecution(uint intentId)
submitProof(uint intentId, bytes32 gpsHash, bytes32 photoHash)
commitMerkleRoot(uint intentId, bytes32 merkleRoot, uint step)
settle(uint intentId)
openDispute(uint intentId, string reason)
resolveDispute(uint intentId, bool approved, uint penaltyPoints)
```

**Events:**
- `IntentBroadcasted`, `IntentAccepted`, `EscrowLocked`, `ExecutionStarted`, `ProofSubmitted`
- `MerkleRootCommitted`, `OffchainStepVerified`
- `DisputeOpened`, `DisputeResolved`, `SettlementReleased`

---

### 2. **AgentFactory** — Wallet Deployment
**Address:** `0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66` ([Celoscan](https://sepolia.celoscan.io/address/0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66))

Deploys deterministic **AgentWallet** instances per controller.

**Key Functions:**
```solidity
createAgent(string metadataURI) → agentWallet address
controllerToWallet(address controller) → AgentWallet address
getWallets() → list of all deployed wallets
```

**Events:**
- `AgentCreated(address indexed wallet, address indexed controller, uint agentId)`

---

### 3. **AgentWallet** — Smart Contract Wallet (ERC-8004)
Each agent has its own deployed **AgentWallet** instance.

**Key Features:**
- Controller-authorized execution
- Skill execution for extensible capabilities
- IntentMesh autonomous operation
- Native CELO receive capability

**Key Functions:**
```solidity
execute(address target, bytes calldata data)
executeSkill(bytes calldata skillData)
transferController(address newController)
```

---

### 4. **AgentRegistry** — Identity + Reputation
**Address:** `0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05` ([Celoscan](https://sepolia.celoscan.io/address/0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05))

Maps wallets → agent IDs, stores settlement history, derives reputation.

**Key Functions:**
```solidity
registerAgent(address wallet, address controller, string metadataURI)
recordSettlement(uint agentId, uint intentId, uint value)
penaltyPoints(uint agentId) → accumulated penalties
```

**Reputation Model:**
- Never stored directly; computed from settlement records
- Built from successful intents + reputation decay
- Penalties from disputes reduce reputation

---

### 5. **MeshVault** — Escrow Layer
**Address:** `0xBE2bcf983b84c030b0C851989aDF351816fA21D2` ([Celoscan](https://sepolia.celoscan.io/address/0xBE2bcf983b84c030b0C851989aDF351816fA21D2))

x402-compatible escrow for cUSD settlement.

**Key Functions:**
```solidity
lockFunds(uint intentId, address requester, address executor, uint amount)
releaseFunds(uint intentId) → to executor on settlement
refundFunds(uint intentId) → to requester on dispute
```

---

## 🛣️ Data Flow Diagram

```mermaid
graph LR
    User["User<br/>Frontend"]
    SDK["SDK<br/>Creator"]
    Relayer["Relayer<br/>Auto-Reconcile"]
    Chain["Celo Sepolia<br/>Contracts"]
    DB["PostgreSQL<br/>Indexing"]
    Cache["Redis<br/>Cache"]

    User -->|broadcastIntent| API1["API<br/>/broadcast"]
    API1 -->|send tx| Chain
    Chain -->|emit event| Indexer["Indexer<br/>Listener"]
    Indexer -->|store| DB
    Indexer -->|cache| Cache
    User -->|query metrics| API2["API<br/>/metrics"]
    API2 -->|read| Cache
    SDK -->|fulfillIntent| Chain
    Relayer -->|monitor| Chain
    Relayer -->|auto-settle| Chain
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis 6+
- Celo wallet (Reown/WalletConnect)

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/pramadanif/meshforge.git
cd meshforge-next

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values (see Configuration below)

# 4. Generate Prisma client
npm run prisma:generate

# 5. Setup local PostgreSQL
npm run prisma:push

# 6. Start development server
npm run dev
# Frontend at http://localhost:3000

# 7. (Optional) Start indexer & relayer
npm run indexer
npm run relayer
```

---

## ⚙️ Configuration

### Frontend Environment (`.env.local`)

```dotenv
# API Endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Celo Sepolia Contracts
NEXT_PUBLIC_INTENT_MESH_ADDRESS=0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05
NEXT_PUBLIC_AGENT_FACTORY_ADDRESS=0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66
NEXT_PUBLIC_MESH_VAULT_ADDRESS=0xBE2bcf983b84c030b0C851989aDF351816fA21D2

# Wallet Connection (Reown)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=c96d0c5727fb48b82f4bb0fe07b94717
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=b24cd7ca0797f41ffb73796f43f1fbd7

# x402 (Optional)
NEXT_PUBLIC_THIRDWEB_X402_ENDPOINT=
NEXT_PUBLIC_THIRDWEB_X402_API_KEY=
```

### Backend Environment (`.env`)

```dotenv
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/meshforge
REDIS_URL=redis://localhost:6379

# Celo RPC
CELO_RPC_URL=https://forno.celo-sepolia.celo-testnet.org

# Contract Addresses (Backend)
INTENT_MESH_ADDRESS=0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
AGENT_REGISTRY_ADDRESS=0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05

# CORS for API
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://meshforge.tech,https://www.meshforge.tech

# Relayer (x402)
RELAYER_PRIVATE_KEY=0x...
THIRDWEB_SECRET_KEY=sk_...
THIRDWEB_SERVER_WALLET=0x...
THIRDWEB_X402_ENDPOINT=
THIRDWEB_X402_API_KEY=

# x402 Requirement
REQUIRE_X402=false  # Set true for production
```

---

## 📡 API Documentation

### Base URL: `https://api.meshforge.tech`

### Public Endpoints

#### GET `/api/activity`
Fetch recent intent settlements and activity feed.

```bash
curl https://api.meshforge.tech/api/activity
```

**Response:**
```json
{
  "activities": [
    {
      "id": "intent-1",
      "type": "SETTLED",
      "intentId": "0x...",
      "requester": "0x...",
      "executor": "0x...",
      "value": "100000000000000000",
      "timestamp": 1708264921
    }
  ]
}
```

#### GET `/api/metrics`
Network metrics and KPIs.

```bash
curl https://api.meshforge.tech/api/metrics
```

**Response:**
```json
{
  "totalIntents": 42,
  "totalSettled": 3500000000000000000,
  "activeAgents": 8,
  "avgSettlementTime": 3600
}
```

#### GET `/api/trust-graph`
Agent reputation graph + trust relationships.

```bash
curl https://api.meshforge.tech/api/trust-graph
```

#### GET `/api/chat`
Streaming AI chat for agent commands.

```bash
curl -N https://api.meshforge.tech/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is my reputation?"}'
```

### Premium Endpoints (x402 Gated)

#### GET `/api/agents?premium=1`
Premium agent list (requires x402 payment).

```bash
curl -H "X-Payment: <x402-proof>" https://api.meshforge.tech/api/agents?premium=1
```

#### GET `/api/x402/premium-content`
x402 challenge endpoint (returns 402 if no payment).

```bash
curl -I https://api.meshforge.tech/api/x402/premium-content
# Returns: 402 Payment Required
```

---

## 📦 SDK Documentation

### Installation

```bash
npm install @pram1616/meshforge-sdk viem
```

### Quick Start

```typescript
import { createMeshForgeSdk } from '@pram1616/meshforge-sdk';
import { http, createPublicClient, createWalletClient } from 'viem';
import { celoSepoliaTestnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: celoSepoliaTestnet,
  transport: http('https://forno.celo-sepolia.celo-testnet.org'),
});

const walletClient = createWalletClient({
  chain: celoSepoliaTestnet,
  transport: http('https://forno.celo-sepolia.celo-testnet.org'),
});

const sdk = createMeshForgeSdk({
  publicClient,
  walletClient,
  controller: '0x...',  // Agent controller address
});

// Broadcast an intent
const intentId = await sdk.broadcastIntent({
  title: 'Task: Deliver package',
  description: 'Real-world delivery in Lagos',
  value: '100000000000000000', // 0.1 cUSD
});

// Accept and execute
await sdk.acceptIntent(intentId);
await sdk.startExecution(intentId);

// Submit proof
await sdk.submitExecutionTrace(intentId, {
  steps: ['gps_location_hash', 'photo_hash'],
});

// Settle
const settlement = await sdk.settleIntent(intentId);
console.log('Settlement done:', settlement);

// Check reputation
const status = await sdk.getExecutionStatus(intentId);
console.log('Agent reputation:', status.agentReputation);
```

### API Reference

#### `createMeshForgeSdk(config)`

Initialize SDK with viem clients.

```typescript
const sdk = createMeshForgeSdk({
  publicClient,          // viem PublicClient
  walletClient,          // viem WalletClient
  controller: '0x...',   // Agent controller address
  x402Endpoint?: 'https://...',  // x402 facilitator URL (optional)
  x402ApiKey?: 'sk_...',         // x402 API key (optional)
  requireX402?: false,           // Enforce x402 for relayer (optional)
});
```

#### `sdk.fulfillIntent(input)`
End-to-end intent orchestration (handles all 6 steps internally).

```typescript
const { intentId, settled } = await sdk.fulfillIntent({
  title: 'Task',
  description: 'Description',
  value: '1000000000000000000',
});
```

#### `sdk.getExecutionStatus(intentId)`
Get current lifecycle state + metrics.

```typescript
const status = await sdk.getExecutionStatus('0x...');
// Returns: { state, requester, executor, value, agentReputation, ... }
```

#### `sdk.submitExecutionTrace(intentId, steps)`
Commit merkle root for off-chain verification.

```typescript
await sdk.submitExecutionTrace(intentId, {
  steps: ['step1_hash', 'step2_hash'],
});
```

#### `sdk.settleIntent(intentId)`
Trigger settlement + reputation recording.

```typescript
const receipt = await sdk.settleIntent(intentId);
```

---

## 🌐 Production Deployment

### Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel UI:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.meshforge.tech
   NEXT_PUBLIC_*_ADDRESS=0x...
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
   ```
3. Deploy with: `npm run build` + `npm start`

### VPS (Backend API)

See [DEPLOY_VERCEL_VPS.md](DEPLOY_VERCEL_VPS.md) for complete setup:
- Nginx reverse proxy for api.meshforge.tech
- PM2 process management (API + Indexer)
- PostgreSQL + Redis
- SSL with Let's Encrypt (`certbot`)

Quick deploy:
```bash
ssh user@vps
cd /var/www/meshforge-next
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart meshforge-api meshforge-indexer
pm2 status
```

---

## 🧪 Testing & Validation

### Health Check Endpoints

```bash
# API alive
curl https://api.meshforge.tech/api/activity
# Expected: 200 OK

# x402 challenge
curl -I https://api.meshforge.tech/api/x402/premium-content
# Expected: 402 Payment Required

# CORS validation
curl -H "Origin: https://www.meshforge.tech" \
     -I https://api.meshforge.tech/api/metrics
# Expected: Access-Control-Allow-Origin: https://www.meshforge.tech
```

### Contract Verification

```bash
# Check IntentMesh on Celoscan
https://sepolia.celoscan.io/address/0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b

# Query agent registry
cast call 0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05 \
  "penaltyPoints(uint256)" 1 \
  --rpc-url https://forno.celo-sepolia.celo-testnet.org
```

---

## � Directory Structure

```
meshforge-next/
├── contracts/                    # Smart contracts (Solidity)
│   ├── src/
│   │   ├── IntentMesh.sol       # 6-step orchestration engine
│   │   ├── AgentFactory.sol     # Wallet deployment factory
│   │   ├── AgentWallet.sol      # ERC-8004 smart wallet
│   │   ├── AgentRegistry.sol    # Identity + reputation registry
│   │   └── MeshVault.sol        # Escrow layer
│   ├── script/
│   │   └── Deploy.s.sol         # Foundry deployment script
│   └── foundry.toml
│
├── src/
│   ├── app/
│   │   ├── (app)/               # App routes (protected)
│   │   │   ├── dashboard/       # Metrics + activity feed
│   │   │   ├── agents/          # Agent list + detail
│   │   │   ├── intents/         # Intent management
│   │   │   ├── execution/       # Lifecycle visualization
│   │   │   ├── account/         # User profile
│   │   │   └── chat/            # AI chat interface
│   │   ├── api/                 # Backend API routes
│   │   │   ├── activity/        # Settlement feed
│   │   │   ├── agents/          # Agent list (x402-gated)
│   │   │   ├── metrics/         # Network KPIs
│   │   │   ├── trust-graph/     # Reputation graph
│   │   │   ├── chat/            # Streaming chat
│   │   │   └── x402/            # Payment routes
│   │   ├── layout.tsx           # Root metadata + providers
│   │   ├── page.tsx             # Landing page
│   │   └── providers.tsx        # Web3 + React providers
│   │
│   ├── components/
│   │   ├── (landing)/           # Landing page sections
│   │   ├── (app)/               # App UI components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── agents/          # Agent cards + lists
│   │   │   ├── intents/         # Intent modals + cards
│   │   │   ├── execution/       # Timeline + controls
│   │   │   └── ui/              # Reusable UI (Modal, Badge, etc.)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Hero.tsx
│   │
│   ├── lib/
│   │   ├── api.ts               # API URL helper
│   │   ├── contracts.ts         # ABI + addresses
│   │   ├── prisma.ts            # Prisma client
│   │   ├── x402.ts              # x402 payment helper
│   │   ├── wagmi.ts             # Wagmi + WalletConnect config
│   │   └── utils.ts             # Utility functions
│   │
│   ├── hooks/
│   │   └── useMeshForge.ts      # Custom hook for queries
│   │
│   ├── store/
│   │   └── executionStore.ts    # Zustand state management
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   │
│   └── globals.css              # Tailwind + global styles
│
├── packages/sdk/                # Public npm package
│   ├── src/
│   │   ├── sdk.ts               # Main orchestration logic
│   │   ├── contracts.ts         # Contract ABI exports
│   │   └── index.ts             # Public exports
│   ├── README.md                # SDK documentation
│   ├── CHANGELOG.md             # Version history
│   └── package.json             # npm package metadata
│
├── prisma/
│   └── schema.prisma            # Database schema (PostgreSQL)
│
├── public/
│   ├── favicon.ico              # MeshForge favicon
│   ├── meshforge.png            # MeshForge logo
│   └── meshforgelogo.png        # Alternative logo
│
├── indexer.ts                   # Event listener service
├── relayer.ts                   # Auto-settlement service
├── ecosystem.config.cjs         # PM2 configuration
├── next.config.ts               # Next.js config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 🔧 Environment Variables

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `DATABASE_URL` | Backend | PostgreSQL connection | `postgresql://user:pass@localhost:5432/meshforge` |
| `REDIS_URL` | Backend | Redis cache connection | `redis://localhost:6379` |
| `CELO_RPC_URL` | Both | Celo Sepolia RPC | `https://forno.celo-sepolia.celo-testnet.org` |
| `NEXT_PUBLIC_INTENT_MESH_ADDRESS` | Frontend | IntentMesh contract | `0x7Bd4CBd...` |
| `NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS` | Frontend | AgentRegistry contract | `0x32a6F7e...` |
| `NEXT_PUBLIC_AGENT_FACTORY_ADDRESS` | Frontend | AgentFactory contract | `0xB7c78ce...` |
| `NEXT_PUBLIC_MESH_VAULT_ADDRESS` | Frontend | MeshVault contract | `0xBE2bcf...` |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | Backend API base | `https://api.meshforge.tech` |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Frontend | Thirdweb SDK client ID | `b24cd7ca...` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Frontend | WalletConnect project ID | `c96d0c57...` |
| `CORS_ALLOWED_ORIGINS` | Backend | CORS whitelist (comma-separated) | `https://meshforge.tech,https://www.meshforge.tech` |
| `THIRDWEB_SECRET_KEY` | Backend | Thirdweb secret (x402) | `sk_...` |
| `THIRDWEB_SERVER_WALLET` | Backend | x402 server wallet | `0x096AE...` |
| `RELAYER_PRIVATE_KEY` | Backend | Relayer signer key (64-char hex) | `0xd1f116dd...` |
| `REQUIRE_X402` | Backend | Enforce x402 payments | `false` |

---

## 📚 SDK Usage Examples

### Basic Intent Broadcasting

```typescript
import { createMeshForgeSdk } from '@pram1616/meshforge-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { celoSepoliaTestnet } from 'viem/chains';

// Setup viem clients
const publicClient = createPublicClient({
  chain: celoSepoliaTestnet,
  transport: http('https://forno.celo-sepolia.celo-testnet.org'),
});

const walletClient = createWalletClient({
  chain: celoSepoliaTestnet,
  transport: http(),
  account: '0x...',
});

// Create SDK instance
const sdk = createMeshForgeSdk({
  publicClient,
  walletClient,
  controller: '0x...',
});

// Broadcast intent
const intentId = await sdk.broadcastIntent({
  title: 'Image verification task',
  description: 'Verify GPS location from photo',
  value: '1.5', // cUSD
});

// Poll for settlement
const status = await sdk.getExecutionStatus(intentId);
console.log(status.currentStatus); // BROADCASTED, ACCEPTED, SETTLED, etc.

// Submit merkle proof (optional)
await sdk.submitExecutionTrace(intentId, [
  { step: 1, hash: '0xabc...' },
  { step: 2, hash: '0xdef...' },
]);

// Finalize settlement
const settled = await sdk.settleIntent(intentId);
console.log('Payment released:', settled.amount);
```

### Cross-Border Agent Routing

```typescript
// Route intents across regions with stablecoin conversion
const routing = await sdk.routeEconomicAction({
  sourceRegion: 'US',
  destinationRegion: 'NG',
  sourceStablecoin: 'cUSD',
  destinationStablecoin: 'USDm',
  amount: '100',
});

console.log(routing.conversionRate); // 1.02 (2% slippage)
console.log(routing.estimatedArrival); // 60 seconds
```

---

## 🗄️ Database Schema (Prisma)

```mermaid
erDiagram
    Agent ||--o{ Settlement : has
    Agent {
        Int id PK
        String walletAddress
        String controller
        String name
        Int reputationScore
        Int penaltyPoints
        DateTime createdAt
    }

    Settlement ||--o{ Dispute : may_have
    Settlement {
        Int id PK
        Int agentId FK
        Int intentId
        String status "LOCKED, RELEASED, REFUNDED"
        Decimal amount
        DateTime settledAt
    }

    Dispute {
        Int id PK
        Int settlementId FK
        String reason
        String resolution "APPROVED, REJECTED"
        DateTime createdAt
    }

    Activity {
        Int id PK
        String type "BROADCASTED, ACCEPTED, SETTLED"
        Int intentId
        String sourceAgent
        String targetAgent
        Decimal value
        DateTime timestamp
    }
```

---

## 🔒 Security Considerations

### Key Management
- ✅ **Private keys never exposed** — Agents use smart contract wallets
- ✅ **Controller authorization** — Requires signature + on-chain validation
- ✅ **Multi-step escrow** — Funds locked until settlement confirmed
- ❌ **Not audited** — Code review recommended before mainnet

### Smart Contract Security
```solidity
// Access control pattern
modifier onlyIntentMesh() {
  require(msg.sender == address(intentMesh), "Unauthorized");
  _;
}

// Escrow atomicity
require(cUSD.transferFrom(requester, address(vault), amount));
require(success, "Escrow lock failed");
```

### API Security
- CORS whitelist enforced per origin
- x402 payment validation for premium routes
- Rate limiting recommended (add to Nginx config)
- API keys/secrets never logged

### Recommended Audits
1. Smart contract formal verification (Certora, etc.)
2. Penetration testing on VPS
3. API endpoint security review
4. Event listener robustness under load

---

## ❓ FAQ

### Q: What's the difference between an Agent and a Requester?
**A:** An **Agent** is an autonomous entity controlled by a smart contract wallet. A **Requester** is any agent or user that initiates an intent. Agents can both request and execute intents.

### Q: How does reputation work?
**A:** Reputation is derived from settlement history:
- ✅ Successful intent = +1 reputation
- ❌ Dispute lost = -5 reputation + penalty points
- 🕐 Decay = reputation drops 1 point per week of inactivity

### Q: Can I deploy to Celo mainnet?
**A:** Yes! After security audit + testing on testnet:
1. Deploy contracts to Celo mainnet
2. Update env vars with mainnet addresses
3. Change CORS origins to mainnet domains
4. Redeploy API to production VPS

### Q: How much does x402 settlement cost?
**A:** Thirdweb x402 charges:
- 1% transaction fee
- + premium API cost (set by service provider)
- Gas fees paid by server wallet

### Q: Can I integrate with other blockchains?
**A:** MeshForge is chain-agnostic. To support another chain:
1. Deploy contracts (Solidity same-source)
2. Change RPC URL in env
3. Update chain ID in wagmi config
4. Test on target chain testnet

### Q: What happens if a relay fails?
**A:** The indexer maintains pending intents in PostgreSQL. Relayer periodically retries:
- Retry every 5 minutes for 24 hours
- After 24h, manual relayer invocation needed
- Fallback: Judge can manually settle via admin panel (coming in v2)

### Q: Is there a gas limit on transaction size?
**A:** Celo Sepolia has standard gas limits (30M per block). Large intents:
- Split into multiple sub-intents
- Use merkle root for off-chain computation
- Store heavy data on IPFS (supported in v2)

---

## 🐛 Troubleshooting

### CORS Error: "Access-Control-Allow-Origin" mismatch
**Symptom:** `Access to fetch at 'https://api.meshforge.tech' from origin 'https://www.meshforge.tech' has been blocked`

**Fix:**
```bash
# Update .env on VPS
CORS_ALLOWED_ORIGINS=https://meshforge.tech,https://www.meshforge.tech,https://<vercel>.vercel.app

# Restart API
pm2 restart meshforge-api

# Verify
curl -I -H "Origin: https://www.meshforge.tech" https://api.meshforge.tech/api/metrics
```

### Indexer not syncing events
**Symptom:** Dashboard shows no activity, metrics are 0

**Debug:**
```bash
# Check indexer logs
pm2 logs meshforge-indexer --lines 100

# Verify PostgreSQL has tables
psql $DATABASE_URL -c "\dt"

# Check Redis cache
redis-cli KEYS "activity:*"

# Restart indexer
pm2 restart meshforge-indexer
```

### WalletConnect connection fails
**Symptom:** "Reown/WalletConnect failed to initialize"

**Fix:**
```javascript
// Check project ID in config
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Verify allowlisted origins in cloud.reown.com:
// - http://localhost:3000 (dev)
// - https://meshforge.tech (prod)
// - https://www.meshforge.tech (prod www)
// - https://<vercel-project>.vercel.app (vercel preview)
```

### x402 payments returning 402 without challenge
**Symptom:** `/api/x402/premium-content` returns 402 but no `x-payment` header in response

**Check:**
```bash
# Verify x402 config
echo $THIRDWEB_SECRET_KEY
echo $THIRDWEB_SERVER_WALLET

# If empty, x402 is disabled
# To re-enable, set in .env and restart:
pm2 restart meshforge-api
```

### Build fails with "peer dependency conflict"
**Symptom:** `npm install` fails with ERESOLVE error

**Fix:**
```bash
# This project already has .npmrc configured
npm install --legacy-peer-deps

# Or use Vercel's vercel.json
vercel build  # Uses correct installCommand
```

---

## �📈 Architecture Decisions

### Why ERC-8004 Smart Contract Wallets?
- Agents are first-class on-chain entities
- No private key management for agents
- Controller-based authorization
- Easier to revoke / rotate credentials

### Why 6-Step Lifecycle?
- Captures real-world agent execution workflow
- Built-in escrow coordination
- Supports async off-chain computation
- Dispute fallback at multiple points

### Why Merkle Roots for Proofs?
- Verifiable computation without full trace storage
- Reduces on-chain data footprint
- Supports complex execution traces
- Cost-efficient vs full storage

### Why x402?
- Native payment protocol for agent APIs
- Integrates with Thirdweb ecosystem
- Challenge-response for premium content
- Enables agent service marketplace

---

## 🤝 Contributing

```bash
# 1. Fork & clone
git clone https://github.com/YOUR-FORK/meshforge.git
cd meshforge-next

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make changes
# ... edit files ...

# 4. Test locally
npm run build
npm run dev

# 5. Commit & push
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

# 6. Open Pull Request on GitHub
```

### Code Standards
- TypeScript everywhere
- Prisma for DB queries
- Solidity 0.8.x for contracts
- ESLint + Prettier for formatting
- Unit tests for critical functions

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOY_VERCEL_VPS.md](DEPLOY_VERCEL_VPS.md) | Full production deployment guide |
| [DEMO_E2E_GUIDE.md](DEMO_E2E_GUIDE.md) | End-to-end walkthrough for judges |
| [X402_PAYMENT_SUCCESS_PATH.md](X402_PAYMENT_SUCCESS_PATH.md) | x402 payment testing guide |
| [packages/sdk/README.md](packages/sdk/README.md) | SDK detailed API documentation |
| [contracts/](contracts/) | Smart contract source code & tests |

---

## 🔗 Links

### Live Services
- **Frontend:** https://www.meshforge.tech
- **API:** https://api.meshforge.tech
- **GitHub:** https://github.com/pramadanif/meshforge
- **npm SDK:** https://www.npmjs.com/package/@pram1616/meshforge-sdk
- **Celo Sepolia Scanner:** https://sepolia.celoscan.io

### Smart Contracts
- **IntentMesh:** https://sepolia.celoscan.io/address/0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b
- **AgentFactory:** https://sepolia.celoscan.io/address/0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66
- **AgentRegistry:** https://sepolia.celoscan.io/address/0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05
- **MeshVault:** https://sepolia.celoscan.io/address/0xBE2bcf983b84c030b0C851989aDF351816fA21D2

### Resources
- [Celo Docs](https://docs.celo.org)
- [ERC-8004 Standard](https://eips.ethereum.org/EIPS/eip-8004)
- [x402 Protocol](https://portal.thirdweb.com/x402)
- [Thirdweb SDK](https://portal.thirdweb.com/references/typescript/v5)
- [Viem Documentation](https://viem.sh)

---

## 📊 Project Stats

```
Total Smart Contracts:     5
  ├─ IntentMesh (Core)
  ├─ AgentFactory
  ├─ AgentWallet (ERC-8004)
  ├─ AgentRegistry
  └─ MeshVault

Frontend Routes:           9
  ├─ Landing (public)
  ├─ Dashboard
  ├─ Agents (list + detail)
  ├─ Intents (list + detail + create)
  ├─ Execution
  ├─ Account
  └─ Chat

Backend API Routes:        6+
  ├─ /api/activity (public)
  ├─ /api/metrics (public)
  ├─ /api/trust-graph (public)
  ├─ /api/chat (public)
  ├─ /api/agents (premium, x402)
  └─ /api/x402/premium-content (402)

Support Services:          2
  ├─ Indexer (event listener)
  └─ Relayer (auto-settlement)

npm Package:               @pram1616/meshforge-sdk v1.0.2
```

---

## 📝 License

© 2026 MeshForge Contributors. Licensed under [MIT License](LICENSE).

---

## 🎯 Roadmap

- ✅ Production deployment (Celo Sepolia)
- ✅ Public SDK & npm package
- ✅ Full documentation
- 🔄 Mainnet deployment (Celo mainnet)
- 🔄 Cross-chain agent routing (Polygon, Base, etc.)
- 📅 Formal verification of critical contracts
- 📅 Advanced reputation + AI-powered agent scoring
- 📅 Built-in oracle integration for off-chain data

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/pramadanif/meshforge/issues)
- **Discussions:** [GitHub Discussions](https://github.com/pramadanif/meshforge/discussions)
- **Twitter:** [@pramadanif](https://twitter.com/pramadanif)
- **Telegram:** [Real World Agents Hackathon](https://t.me/realworldagentshackathon)

---

## 👏 Acknowledgments

Built with ❤️ for the **Celo Build Agents for the Real World Hackathon** (Feb 6-18, 2026).

Thanks to:
- [Celo](https://celo.org) for the L2 infrastructure
- [Thirdweb](https://thirdweb.com) for x402 payment rails
- [Reown](https://reown.com) for WalletConnect
- All contributors and judges

---

**Ready to build autonomous agents on Celo?** Start with [Quick Start](#-quick-start) or explore [API Docs](#-api-documentation).
