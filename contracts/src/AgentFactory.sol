// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {AgentWallet} from "./AgentWallet.sol";

/// @title AgentFactory — Factory for deploying ERC-8004 AgentWallet instances
/// @notice Creates new agent smart contract wallets and registers them
contract AgentFactory {

    address public registry;
    address public intentMesh;
    address public owner;

    uint256 public totalAgentsCreated;

    mapping(address => address) public controllerToWallet; // controller → AgentWallet
    address[] public allWallets;

    // ─── Events ──────────────────────────────────────────────────────────
    event AgentCreated(
        address indexed wallet,
        address indexed controller,
        uint256 indexed agentId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _registry) {
        owner = msg.sender;
        registry = _registry;
    }

    /// @notice Set IntentMesh address (called after IntentMesh deployment)
    function setIntentMesh(address _intentMesh) external onlyOwner {
        intentMesh = _intentMesh;
    }

    /// @notice Create a new AgentWallet for a controller
    /// @param metadataURI IPFS or onchain metadata (name, skills, etc.)
    /// @return wallet The deployed AgentWallet address
    function createAgent(string calldata metadataURI) external returns (address wallet) {
        require(controllerToWallet[msg.sender] == address(0), "Already has agent");
        require(intentMesh != address(0), "IntentMesh not set");

        // Deploy new AgentWallet
        AgentWallet agentWallet = new AgentWallet();
        wallet = address(agentWallet);

        // Register in AgentRegistry — registry assigns agentId
        // We call registry.registerAgent(wallet, msg.sender, metadataURI)
        (bool success, bytes memory data) = registry.call(
            abi.encodeWithSignature(
                "registerAgent(address,address,string)",
                wallet,
                msg.sender,
                metadataURI
            )
        );
        require(success, "Registry registration failed");
        uint256 agentId = abi.decode(data, (uint256));

        // Initialize the wallet
        agentWallet.initialize(msg.sender, intentMesh, registry, agentId);

        controllerToWallet[msg.sender] = wallet;
        allWallets.push(wallet);
        totalAgentsCreated++;

        emit AgentCreated(wallet, msg.sender, agentId);
        return wallet;
    }

    /// @notice Get all deployed wallets
    function getWallets() external view returns (address[] memory) {
        return allWallets;
    }
}
