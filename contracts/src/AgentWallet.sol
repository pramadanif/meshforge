// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title AgentWallet — ERC-8004 Smart Contract Wallet for Autonomous Agents
/// @notice Each agent is a deployed smart contract wallet, NOT an EOA.
///         Supports autonomous execution, skill execution, and controller ownership.
contract AgentWallet {

    address public controller;     // Human or DAO that controls this agent
    address public intentMesh;     // IntentMesh contract authorized to call
    address public registry;       // AgentRegistry for identity
    uint256 public agentId;        // Assigned by AgentRegistry
    bool public initialized;

    // ─── Events ──────────────────────────────────────────────────────────
    event Executed(address indexed target, uint256 value, bytes data);
    event SkillExecuted(bytes skillData);
    event ControllerTransferred(address indexed oldController, address indexed newController);

    modifier onlyController() {
        require(msg.sender == controller, "Not controller");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == controller || msg.sender == intentMesh,
            "Not authorized"
        );
        _;
    }

    /// @notice Initialize the wallet (called by AgentFactory)
    function initialize(
        address _controller,
        address _intentMesh,
        address _registry,
        uint256 _agentId
    ) external {
        require(!initialized, "Already initialized");
        controller = _controller;
        intentMesh = _intentMesh;
        registry = _registry;
        agentId = _agentId;
        initialized = true;
    }

    /// @notice Execute arbitrary call — agent acts as msg.sender
    function execute(
        address target,
        bytes calldata data
    ) external payable onlyAuthorized returns (bytes memory) {
        (bool success, bytes memory result) = target.call{value: msg.value}(data);
        require(success, "Execution failed");
        emit Executed(target, msg.value, data);
        return result;
    }

    /// @notice Execute a skill — extensible agent capability
    function executeSkill(bytes calldata skillData) external onlyAuthorized {
        // Skills can be decoded and routed to specific handlers
        // For now, emit event for indexer to track
        emit SkillExecuted(skillData);
    }

    /// @notice Transfer controller ownership
    function transferController(address newController) external onlyController {
        require(newController != address(0), "Invalid controller");
        address old = controller;
        controller = newController;
        emit ControllerTransferred(old, newController);
    }

    /// @notice Update IntentMesh authorization
    function setIntentMesh(address _intentMesh) external onlyController {
        intentMesh = _intentMesh;
    }

    /// @notice Receive native CELO
    receive() external payable {}
    fallback() external payable {}
}
