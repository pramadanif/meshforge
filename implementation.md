MeshForge-v2-Onchain-Implementation-Plan.md
1. OBJECTIVE

Mengubah MeshForge v2 dari:

FE-driven lifecycle simulator

menjadi:

Onchain Intent Coordination Protocol
dimana execution lifecycle hanya bisa berubah melalui emitted smart contract events.

Semua UI harus menjadi:

reflection of chain truth

bukan:

source of execution state

2. CORE ARCHITECTURE
Agent (ERC-8004)
        ↓
IntentMesh.sol
        ↓
MeshVault.sol (x402 escrow)
        ↓
Execution Lifecycle Events
        ↓
Indexer Listener
        ↓
Supabase + Redis Read Layer
        ↓
Frontend Event Subscription (wagmi)

3. REQUIRED RESOURCES
⚒️ Resources:

ERC-8004 → Agent wallet standard

x402 → Payment protocol for agent transactions

celo/skills → Agent capability framework

8004scan.io → On-chain scanner for agent activity

Celo Docs → Network integration & SDKs

4. SMART CONTRACT LAYER
4.1 AgentRegistry.sol (ERC-8004 Identity Layer)

Responsibilities:

Register AgentID

Store soulbound metadata

Maintain portable reputation

State:

mapping(uint256 => uint256) public reputation;
mapping(address => uint256) public agentOf;


Functions:

registerAgent(address owner, string metadataURI)
getAgentId(address owner)
getReputation(uint256 agentId)
updateReputation(uint256 agentId, uint256 delta)


Events:

event AgentRegistered(uint256 agentId);
event ReputationUpdated(uint256 agentId, uint256 delta);


Judge akan cek portability via ERC-8004 scanner.

4.2 IntentMesh.sol (Economic Coordination Engine)

Struct:

struct Intent {
  uint256 id;
  uint256 requesterAgentId;
  uint256 executorAgentId;
  uint256 value;
  Status status;
}


Enum:

BROADCASTED
ACCEPTED
ESCROW_LOCKED
EXECUTION_STARTED
PROOF_SUBMITTED
SETTLED
REPUTATION_UPDATED


Core Functions:

broadcastIntent()
acceptIntent()
startExecution()
submitProof(bytes32 gpsHash, bytes32 photoHash)
settle()


Events:

IntentAccepted(intentId)
EscrowLocked(intentId)
ExecutionStarted(intentId)
ProofSubmitted(intentId)
SettlementReleased(intentId)
ReputationUpdated(agentId)

4.3 MeshVault.sol (x402 Escrow Layer)

Integrasi:

Thirdweb x402

cUSD (Celo native stablecoin)

Functions:

lockFunds(intentId)
releaseFunds(intentId)
refundFunds(intentId)


Escrow HARUS conditional.

4.4 Reputation Hook (SETTLEMENT LOGIC)

Dalam:

settle()


HARUS:

agentRegistry.updateReputation(
  executorAgentId,
  computeDelta(value, successRate)
);


Dan emit:

ReputationUpdated()

5. INDEXER LAYER (DISCOVERY ENGINE)

Frontend tidak boleh:

query contract langsung untuk UI state

Implement:

Node Listener Service

Listen ke:

IntentAccepted

EscrowLocked

ExecutionStarted

ProofSubmitted

SettlementReleased

ReputationUpdated

Persist ke:

intent_execution_state
agent_reputation
execution_logs


Stack:

Supabase (Postgres)
Redis (event cache)

6. RELAYER SERVICE (GASLESS EXECUTION)

User tidak boleh bayar gas.

Implement:

relayer.ts


Gunakan:

Thirdweb x402

viem wallet client

Handle:

lockEscrow()
startExecution()
settle()


via:

meta-transactions

7. FRONTEND BINDING

Replace seluruh:

setTimeout lifecycle simulation


dengan:

wagmi useWatchContractEvent()


Subscribe ke:

EscrowLocked

ExecutionStarted

ProofSubmitted

SettlementReleased

ReputationUpdated

ExecutionProvider sekarang:

update state hanya jika event diterima

8. EXECUTION FLOW (REAL ONCHAIN)
Agent A
broadcastIntent()


↓

Agent B
acceptIntent()


↓

Relayer
lockEscrow()


↓

ExecutionStarted()


↓

Agent B
submitProof()


↓

Relayer
settle()


↓

Smart Contract Emit:

SettlementReleased
ReputationUpdated


↓

Indexer update DB

↓

Frontend detect event

↓

UI update:

412 → 449

9. DEMO REQUIREMENT

Judge klik:

Start Execution


Harus menghasilkan:

escrow benar-benar terkunci

tx hash valid

settlement benar-benar release

reputation benar-benar berubah

Verifier:

8004scan.io

Celo Explorer

10. SUCCESS CONDITION

MeshForge dianggap:

Onchain Agent Economy

jika:

Execution lifecycle tidak bisa berubah tanpa tx

Jika FE masih bisa update timeline tanpa:

SettlementReleased event


maka sistem masih:

UI-driven simulation

bukan:

Autonomous Coordination Protocol

Ini blueprint yang harus diikuti AI agent kamu supaya:

MeshForge benar-benar menjalankan ekonomi di chain
bukan sekadar mendemokan koordinasi.