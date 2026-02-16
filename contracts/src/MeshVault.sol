// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

/// @title MeshVault — x402-style Escrow Layer for MeshForge
/// @notice Holds cUSD in escrow during intent execution.
///         Only IntentMesh can lock/release/refund.
contract MeshVault {

    struct Escrow {
        uint256 intentId;
        address requester;       // AgentWallet that locked funds
        address executor;        // AgentWallet that receives on settlement
        uint256 amount;
        bool locked;
        bool released;
        bool refunded;
    }

    mapping(uint256 => Escrow) public escrows;

    address public intentMesh;
    address public owner;
    IERC20 public immutable cUSD;

    // ─── Events ──────────────────────────────────────────────────────────
    event EscrowLocked(uint256 indexed intentId, address indexed requester, uint256 amount);
    event EscrowReleased(uint256 indexed intentId, address indexed executor, uint256 amount);
    event EscrowRefunded(uint256 indexed intentId, address indexed requester, uint256 amount);
    event SettlementReleased(uint256 indexed intentId);

    modifier onlyIntentMesh() {
        require(msg.sender == intentMesh, "Only IntentMesh");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address cUSDToken) {
        owner = msg.sender;
        cUSD = IERC20(cUSDToken);
    }

    /// @notice Set the IntentMesh contract address
    function setIntentMesh(address _intentMesh) external onlyOwner {
        intentMesh = _intentMesh;
    }

    /// @notice Lock funds for an intent — called by IntentMesh
    function lockFunds(
        uint256 intentId,
        address requester,
        address executor,
        uint256 amount
    ) external onlyIntentMesh {
        require(amount > 0, "No funds sent");
        require(!escrows[intentId].locked, "Already locked");
        require(cUSD.transferFrom(requester, address(this), amount), "cUSD transfer failed");

        escrows[intentId] = Escrow({
            intentId: intentId,
            requester: requester,
            executor: executor,
            amount: amount,
            locked: true,
            released: false,
            refunded: false
        });

        emit EscrowLocked(intentId, requester, amount);
    }

    /// @notice Release funds to executor — called by IntentMesh on settlement
    function releaseFunds(uint256 intentId) external onlyIntentMesh {
        Escrow storage e = escrows[intentId];
        require(e.locked, "Not locked");
        require(!e.released && !e.refunded, "Already finalized");

        e.released = true;

        require(cUSD.transfer(e.executor, e.amount), "Transfer failed");

        emit EscrowReleased(intentId, e.executor, e.amount);
        emit SettlementReleased(intentId);
    }

    /// @notice Refund funds to requester — called on dispute/cancel
    function refundFunds(uint256 intentId) external onlyIntentMesh {
        Escrow storage e = escrows[intentId];
        require(e.locked, "Not locked");
        require(!e.released && !e.refunded, "Already finalized");

        e.refunded = true;

        require(cUSD.transfer(e.requester, e.amount), "Refund failed");

        emit EscrowRefunded(intentId, e.requester, e.amount);
    }

    /// @notice Get escrow details
    function getEscrow(uint256 intentId) external view returns (Escrow memory) {
        return escrows[intentId];
    }
}
