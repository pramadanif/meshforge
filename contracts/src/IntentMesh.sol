// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AgentRegistry} from "./AgentRegistry.sol";
import {MeshVault} from "./MeshVault.sol";

/// @title IntentMesh — Onchain Intent Coordination Engine (ERC-8004 Compliant)
/// @notice 6-step lifecycle: BROADCASTED → ACCEPTED → ESCROW_LOCKED → EXECUTION_STARTED → PROOF_SUBMITTED → SETTLED
/// @dev All state transitions emit events. UI MUST subscribe to events via useWatchContractEvent().
///      Lifecycle CANNOT progress without confirmed tx. Settlement records history in AgentRegistry.
contract IntentMesh {

    enum Status {
        BROADCASTED,           // 0
        ACCEPTED,              // 1
        ESCROW_LOCKED,         // 2
        EXECUTION_STARTED,     // 3
        PROOF_SUBMITTED,       // 4
        SETTLED                // 5
    }

    struct Intent {
        uint256 id;
        uint256 requesterAgentId;
        uint256 executorAgentId;
        address requester;       // AgentWallet address (NOT EOA)
        address executor;        // AgentWallet address (NOT EOA)
        string title;
        string description;
        uint256 value;
        Status status;
        bytes32 gpsHash;
        bytes32 photoHash;
        bytes32 offchainMerkleRoot;
        bool disputed;
        bool fallbackResolved;
        uint256 sourceRegion;
        uint256 destinationRegion;
        uint256 createdAt;
    }

    struct DisputeCase {
        uint256 intentId;
        uint256 openedAt;
        uint256 amount;
        uint256 challengerAgentId;
        bool resolved;
    }

    struct CrossBorderSettlement {
        string sourceStable;
        string destinationStable;
        bool configured;
    }

    uint256 public intentCount;
    uint256 public minFallbackDisputeValue = 5 ether;
    uint256 public minAgentInteractionsForBypass = 10;
    uint256 public defaultPenaltyPoints = 25;
    mapping(uint256 => Intent) public intents;
    mapping(uint256 => DisputeCase) public disputes;
    mapping(uint256 => CrossBorderSettlement) public crossBorderSettlements;

    AgentRegistry public agentRegistry;
    MeshVault public meshVault;
    address public owner;

    // ─── Events (Frontend MUST subscribe to ALL of these) ─────────────────
    event IntentBroadcasted(uint256 indexed intentId, uint256 indexed requesterAgentId, address requester, string title, uint256 value);
    event IntentAccepted(uint256 indexed intentId, uint256 indexed executorAgentId, address executor);
    event EscrowLocked(uint256 indexed intentId, uint256 amount);
    event ExecutionStarted(uint256 indexed intentId);
    event ProofSubmitted(uint256 indexed intentId, bytes32 gpsHash, bytes32 photoHash);
    event MerkleRootCommitted(uint256 indexed intentId, bytes32 merkleRoot, uint256 indexed step);
    event OffchainStepVerified(uint256 indexed intentId, bytes32 leaf, uint256 indexed step, bool valid);
    event DisputeOpened(uint256 indexed intentId, uint256 indexed challengerAgentId, uint256 amount, string reason);
    event DisputeResolved(uint256 indexed intentId, bool approved, uint256 penaltyPoints, string evidenceRef);
    event CrossBorderRouteSet(uint256 indexed intentId, uint256 indexed sourceRegion, uint256 indexed destinationRegion);
    event CrossBorderStablecoinsSet(uint256 indexed intentId, string sourceStable, string destinationStable);
    event SettlementReleased(uint256 indexed intentId, uint256 amount, uint256 indexed executorAgentId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _agentRegistry, address _meshVault) {
        agentRegistry = AgentRegistry(_agentRegistry);
        meshVault = MeshVault(_meshVault);
        owner = msg.sender;
    }

    function setFallbackConfig(
        uint256 _minFallbackDisputeValue,
        uint256 _minAgentInteractionsForBypass,
        uint256 _defaultPenaltyPoints
    ) external onlyOwner {
        minFallbackDisputeValue = _minFallbackDisputeValue;
        minAgentInteractionsForBypass = _minAgentInteractionsForBypass;
        defaultPenaltyPoints = _defaultPenaltyPoints;
    }

    // ─── Helper: require msg.sender is a registered AgentWallet ──────────
    function _requireAgent(address wallet) internal view returns (uint256) {
        uint256 agentId = agentRegistry.agentOf(wallet);
        require(agentId != 0, "Not a registered agent wallet");
        return agentId;
    }

    // ─── 1. Broadcast Intent ─────────────────────────────────────────────
    /// @notice AgentWallet broadcasts an intent to the mesh
    /// @dev msg.sender MUST be an AgentWallet, not an EOA
    function broadcastIntent(
        string calldata title,
        string calldata description,
        uint256 value
    ) external returns (uint256) {
        uint256 agentId = _requireAgent(msg.sender);

        uint256 intentId = intentCount++;
        intents[intentId] = Intent({
            id: intentId,
            requesterAgentId: agentId,
            executorAgentId: 0,
            requester: msg.sender,
            executor: address(0),
            title: title,
            description: description,
            value: value,
            status: Status.BROADCASTED,
            gpsHash: bytes32(0),
            photoHash: bytes32(0),
            offchainMerkleRoot: bytes32(0),
            disputed: false,
            fallbackResolved: false,
            sourceRegion: 0,
            destinationRegion: 0,
            createdAt: block.timestamp
        });

        emit IntentBroadcasted(intentId, agentId, msg.sender, title, value);
        return intentId;
    }

    // ─── 2. Accept Intent ────────────────────────────────────────────────
    /// @notice AgentWallet accepts an intent as executor
    function acceptIntent(uint256 intentId) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.BROADCASTED, "Not broadcasted");

        uint256 executorAgentId = _requireAgent(msg.sender);
        require(msg.sender != intent.requester, "Cannot accept own intent");

        intent.executorAgentId = executorAgentId;
        intent.executor = msg.sender;
        intent.status = Status.ACCEPTED;

        emit IntentAccepted(intentId, executorAgentId, msg.sender);
    }

    // ─── 3. Lock Escrow (Requester locks cUSD funds) ─────────────────────
    /// @notice Requester AgentWallet locks cUSD into MeshVault
    /// @dev Escrow MUST be locked before execution can start
    function lockEscrow(uint256 intentId) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.ACCEPTED, "Not accepted");
        require(msg.sender == intent.requester, "Only requester");

        // Pull cUSD from requester AgentWallet into MeshVault
        meshVault.lockFunds(intentId, intent.requester, intent.executor, intent.value);

        intent.status = Status.ESCROW_LOCKED;
        emit EscrowLocked(intentId, intent.value);
    }

    // ─── 4. Start Execution ──────────────────────────────────────────────
    /// @notice Executor signals execution has started
    /// @dev REQUIRES escrow locked — cannot start without confirmed escrow tx
    function startExecution(uint256 intentId) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.ESCROW_LOCKED, "Escrow not locked");
        require(msg.sender == intent.executor, "Only executor");

        intent.status = Status.EXECUTION_STARTED;
        emit ExecutionStarted(intentId);
    }

    // ─── 5. Submit Proof ─────────────────────────────────────────────────
    /// @notice Executor submits proof of work (GPS hash + photo hash)
    /// @dev REQUIRES execution started — proof MUST exist before settlement
    function submitProof(uint256 intentId, bytes32 gpsHash, bytes32 photoHash) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.EXECUTION_STARTED, "Execution not started");
        require(msg.sender == intent.executor, "Only executor");

        intent.gpsHash = gpsHash;
        intent.photoHash = photoHash;
        intent.status = Status.PROOF_SUBMITTED;

        emit ProofSubmitted(intentId, gpsHash, photoHash);
    }

    /// @notice Commit Merkle root for offchain step trace (proof chunking, delivery checkpoints, etc.)
    /// @dev step index convention: 1=discovery, 2=negotiation, 3=delivery, 4=verification
    function commitMerkleRoot(uint256 intentId, bytes32 merkleRoot, uint256 step) external {
        Intent storage intent = intents[intentId];
        require(intent.status != Status.SETTLED, "Already settled");
        require(msg.sender == intent.requester || msg.sender == intent.executor, "Only participants");
        require(merkleRoot != bytes32(0), "Invalid root");

        intent.offchainMerkleRoot = merkleRoot;
        emit MerkleRootCommitted(intentId, merkleRoot, step);
    }

    /// @notice Verify merkle membership for an offchain event leaf
    function verifyOffchainStep(
        uint256 intentId,
        bytes32 leaf,
        bytes32[] calldata proof,
        uint256 step
    ) external view returns (bool) {
        Intent storage intent = intents[intentId];
        bytes32 root = intent.offchainMerkleRoot;
        if (root == bytes32(0)) return false;

        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        bool valid = (computedHash == root);
        return valid;
    }

    /// @notice Emit verifiability event after checking a Merkle proof
    function emitOffchainStepVerification(
        uint256 intentId,
        bytes32 leaf,
        bytes32[] calldata proof,
        uint256 step
    ) external {
        bool valid = this.verifyOffchainStep(intentId, leaf, proof, step);
        emit OffchainStepVerified(intentId, leaf, step, valid);
    }

    /// @notice Tag intent with cross-border route metadata for analytics/demo
    function setCrossBorderRoute(uint256 intentId, uint256 sourceRegion, uint256 destinationRegion) external {
        Intent storage intent = intents[intentId];
        require(msg.sender == intent.requester || msg.sender == intent.executor, "Only participants");
        require(sourceRegion != 0 && destinationRegion != 0, "Invalid route");

        intent.sourceRegion = sourceRegion;
        intent.destinationRegion = destinationRegion;
        emit CrossBorderRouteSet(intentId, sourceRegion, destinationRegion);
    }

    /// @notice Set source/destination stablecoin rails for cross-border settlement
    function setCrossBorderStablecoins(uint256 intentId, string calldata sourceStable, string calldata destinationStable) external {
        Intent storage intent = intents[intentId];
        require(msg.sender == intent.requester || msg.sender == intent.executor, "Only participants");
        require(bytes(sourceStable).length > 0 && bytes(destinationStable).length > 0, "Invalid stablecoin");

        crossBorderSettlements[intentId] = CrossBorderSettlement({
            sourceStable: sourceStable,
            destinationStable: destinationStable,
            configured: true
        });

        emit CrossBorderStablecoinsSet(intentId, sourceStable, destinationStable);
    }

    /// @notice Open fallback dispute for high-value/low-history intents
    function openDispute(uint256 intentId, string calldata reason) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.PROOF_SUBMITTED || intent.status == Status.SETTLED, "Invalid status");
        require(msg.sender == intent.requester || msg.sender == intent.executor, "Only participants");
        require(disputes[intentId].openedAt == 0, "Dispute exists");

        uint256 challengerAgentId = _requireAgent(msg.sender);
        uint256 executorSettlements = agentRegistry.getSettlementCount(intent.executorAgentId);
        bool needsFallback = intent.value >= minFallbackDisputeValue || executorSettlements < minAgentInteractionsForBypass;
        require(needsFallback, "Fallback not required");

        disputes[intentId] = DisputeCase({
            intentId: intentId,
            openedAt: block.timestamp,
            amount: intent.value,
            challengerAgentId: challengerAgentId,
            resolved: false
        });

        intent.disputed = true;
        emit DisputeOpened(intentId, challengerAgentId, intent.value, reason);
    }

    /// @notice Resolve fallback dispute (oracle/human attestor via owner for hackathon scope)
    /// @dev approved=true keeps normal outcome; approved=false penalizes executor and marks resolved
    function resolveDispute(
        uint256 intentId,
        bool approved,
        uint256 penaltyPoints,
        string calldata evidenceRef
    ) external onlyOwner {
        DisputeCase storage d = disputes[intentId];
        Intent storage intent = intents[intentId];
        require(d.openedAt != 0, "No dispute");
        require(!d.resolved, "Already resolved");

        d.resolved = true;
        intent.fallbackResolved = true;

        uint256 appliedPenalty = approved ? 0 : (penaltyPoints == 0 ? defaultPenaltyPoints : penaltyPoints);
        if (appliedPenalty > 0) {
            agentRegistry.penalizeAgent(intent.executorAgentId, appliedPenalty, "DISPUTE_REJECTED");
        }

        emit DisputeResolved(intentId, approved, appliedPenalty, evidenceRef);
    }

    // ─── 6. Settle — Release funds + Record settlement ───────────────────
    /// @notice Requester confirms delivery → releases escrow → records settlement
    /// @dev Settlement is the ONLY way reputation changes. This function:
    ///      1. Releases escrow via MeshVault
    ///      2. Records settlement via AgentRegistry
    ///      3. Emits SettlementReleased event
    ///      Frontend MUST wait for SettlementReleased to update UI state.
    function settle(uint256 intentId) external {
        Intent storage intent = intents[intentId];
        require(intent.status == Status.PROOF_SUBMITTED, "Proof not submitted");
        require(msg.sender == intent.requester, "Only requester");
        if (intent.disputed) {
            require(intent.fallbackResolved, "Dispute unresolved");
        }

        // 1. Release funds from vault to executor
        meshVault.releaseFunds(intentId);

        // 2. Record settlement in registry (this is how reputation changes)
        agentRegistry.recordSettlement(
            intentId,
            intent.executorAgentId,
            intent.value
        );

        // 3. Update status and emit
        intent.status = Status.SETTLED;
        emit SettlementReleased(intentId, intent.value, intent.executorAgentId);
    }

    // ─── Read Functions ──────────────────────────────────────────────────

    /// @notice Get a single intent
    function getIntent(uint256 intentId) external view returns (Intent memory) {
        return intents[intentId];
    }
}
