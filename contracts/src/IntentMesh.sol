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
        uint256 createdAt;
    }

    uint256 public intentCount;
    mapping(uint256 => Intent) public intents;

    AgentRegistry public agentRegistry;
    MeshVault public meshVault;
    address public owner;

    // ─── Events (Frontend MUST subscribe to ALL of these) ─────────────────
    event IntentBroadcasted(uint256 indexed intentId, uint256 indexed requesterAgentId, address requester, string title, uint256 value);
    event IntentAccepted(uint256 indexed intentId, uint256 indexed executorAgentId, address executor);
    event EscrowLocked(uint256 indexed intentId, uint256 amount);
    event ExecutionStarted(uint256 indexed intentId);
    event ProofSubmitted(uint256 indexed intentId, bytes32 gpsHash, bytes32 photoHash);
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
