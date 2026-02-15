// TODO: Replace with deployed contract address on Celo Alfajores
export const MESH_FORGE_ADDRESS = '0x1234567890123456789012345678901234567890' as const;

export const MESH_FORGE_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "title", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "string", "name": "category", "type": "string" }
        ],
        "name": "createIntent",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "payable", // msg.value might be used for staking or fees, or amount if native cUSD handling
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "intentId", "type": "uint256" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "string", "name": "message", "type": "string" }
        ],
        "name": "submitOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "intentId", "type": "uint256" },
            { "internalType": "uint256", "name": "offerId", "type": "uint256" }
        ],
        "name": "acceptOffer",
        "outputs": [],
        "stateMutability": "payable", // Locking the funds
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "intentId", "type": "uint256" }
        ],
        "name": "settleIntent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "intentCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
        "name": "getIntent",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "address", "name": "creator", "type": "address" },
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" },
                    { "internalType": "uint256", "name": "deadline", "type": "uint256" },
                    { "internalType": "enum MeshForge.IntentStatus", "name": "status", "type": "uint8" }
                ],
                "internalType": "struct MeshForge.Intent",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "agent", "type": "address" }
        ],
        "name": "getAgentProfile",
        "outputs": [
            { "internalType": "uint256", "name": "reputation", "type": "uint256" },
            { "internalType": "uint256", "name": "completedIntents", "type": "uint256" },
            { "internalType": "uint256", "name": "totalVolume", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "intentId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "title", "type": "string" }
        ],
        "name": "IntentCreated",
        "type": "event"
    }
] as const;
