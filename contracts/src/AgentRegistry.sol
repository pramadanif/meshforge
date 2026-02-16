// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title AgentRegistry — Agent Identity + Settlement-Derived Reputation
/// @notice Maps AgentWallet → AgentID. Stores SettlementRecord[].
///         Reputation is DERIVED from settlement history, NEVER stored directly.
contract AgentRegistry {

    struct SettlementRecord {
        uint256 intentId;
        uint256 executorAgentId;
        uint256 value;
        uint256 timestamp;
    }

    struct Agent {
        uint256 id;
        address wallet;          // AgentWallet smart contract address
        address controller;      // Human/DAO controller
        string metadataURI;
        uint256 registeredAt;
    }

    uint256 public nextAgentId = 1;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public agentOf;          // wallet → agentId
    mapping(uint256 => SettlementRecord[]) public settlements; // agentId → records

    // Authorized callers (IntentMesh + AgentFactory)
    mapping(address => bool) public authorized;
    address public owner;

    // ─── Events ──────────────────────────────────────────────────────────
    event AgentRegistered(uint256 indexed agentId, address indexed wallet, address indexed controller, string metadataURI);
    event SettlementRecorded(uint256 indexed intentId, uint256 indexed agentId, uint256 value, uint256 timestamp);
    event AuthorizedCaller(address indexed caller, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Set an authorized caller (AgentFactory or IntentMesh)
    function setAuthorized(address caller, bool status) external onlyOwner {
        authorized[caller] = status;
        emit AuthorizedCaller(caller, status);
    }

    /// @notice Register a new agent (called by AgentFactory)
    /// @param wallet The AgentWallet smart contract address
    /// @param controller The human/DAO controller
    /// @param metadataURI IPFS or onchain metadata
    function registerAgent(
        address wallet,
        address controller,
        string calldata metadataURI
    ) external onlyAuthorized returns (uint256) {
        require(agentOf[wallet] == 0, "Already registered");

        uint256 agentId = nextAgentId++;
        agents[agentId] = Agent({
            id: agentId,
            wallet: wallet,
            controller: controller,
            metadataURI: metadataURI,
            registeredAt: block.timestamp
        });
        agentOf[wallet] = agentId;

        emit AgentRegistered(agentId, wallet, controller, metadataURI);
        return agentId;
    }

    /// @notice Record a settlement — called by IntentMesh after settle()
    /// @dev This is the ONLY way reputation changes. No mutable score.
    function recordSettlement(
        uint256 intentId,
        uint256 executorAgentId,
        uint256 value
    ) external onlyAuthorized {
        require(agents[executorAgentId].wallet != address(0), "Agent does not exist");

        SettlementRecord memory record = SettlementRecord({
            intentId: intentId,
            executorAgentId: executorAgentId,
            value: value,
            timestamp: block.timestamp
        });

        settlements[executorAgentId].push(record);

        emit SettlementRecorded(intentId, executorAgentId, value, block.timestamp);
    }

    /// @notice Derive reputation from settlement history — COMPUTED, not stored
    /// @dev Formula: sum(value) * count * recencyMultiplier / 1e18
    function getReputation(uint256 agentId) external view returns (uint256) {
        SettlementRecord[] storage records = settlements[agentId];
        uint256 len = records.length;
        if (len == 0) return 0;

        uint256 totalValue;
        uint256 recentCount;

        for (uint256 i = 0; i < len; i++) {
            totalValue += records[i].value;
            // Recency: settlements in last 30 days count double
            if (block.timestamp - records[i].timestamp < 30 days) {
                recentCount++;
            }
        }

        // Reputation = (totalValue / 1e18) * completionCount + recencyBonus
        uint256 volumeScore = totalValue / 1 ether;   // Normalize from wei
        uint256 completionScore = len * 10;             // 10 points per completion
        uint256 recencyBonus = recentCount * 5;         // 5 bonus per recent

        return volumeScore + completionScore + recencyBonus;
    }

    /// @notice Get agent profile by wallet address
    function getAgentProfile(address wallet) external view returns (
        uint256 agentId,
        uint256 reputation,
        uint256 completedIntents,
        uint256 totalVolume,
        string memory metadataURI
    ) {
        uint256 id = agentOf[wallet];
        if (id == 0) return (0, 0, 0, 0, "");

        Agent storage a = agents[id];
        SettlementRecord[] storage records = settlements[id];

        uint256 volume;
        for (uint256 i = 0; i < records.length; i++) {
            volume += records[i].value;
        }

        return (
            id,
            this.getReputation(id),
            records.length,
            volume,
            a.metadataURI
        );
    }

    /// @notice Get settlement count for an agent
    function getSettlementCount(uint256 agentId) external view returns (uint256) {
        return settlements[agentId].length;
    }

    /// @notice Get a single settlement record
    function getSettlement(uint256 agentId, uint256 index) external view returns (SettlementRecord memory) {
        return settlements[agentId][index];
    }

    /// @notice Get the agentId for a wallet address
    function getAgentId(address wallet) external view returns (uint256) {
        return agentOf[wallet];
    }

    /// @notice Get full agent struct
    function getAgent(uint256 agentId) external view returns (Agent memory) {
        return agents[agentId];
    }
}
