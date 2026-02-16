export const INTENT_MESH_ADDRESS = (process.env.NEXT_PUBLIC_INTENT_MESH_ADDRESS ?? '0xDfef62cf7516508B865440E5819e5435e69adceb') as `0x${string}`;
export const AGENT_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS ?? '0x93dBc50500C7817eEFFA29E44750D388687D19F4') as `0x${string}`;
export const AGENT_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_FACTORY_ADDRESS ?? '0xc679034e29A1D5E03fd4DfBF2DE981D4b758aE5A') as `0x${string}`;
export const MESH_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_MESH_VAULT_ADDRESS ?? '0x875507ef1fE7b067eAFea09BddFF193c30f1D21B') as `0x${string}`;

export const INTENT_MESH_ABI = [
    {
        type: 'function',
        name: 'broadcastIntent',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'title', type: 'string', internalType: 'string' },
            { name: 'description', type: 'string', internalType: 'string' },
            { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    },
    {
        type: 'function',
        name: 'acceptIntent',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'intentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
    },
    {
        type: 'function',
        name: 'lockEscrow',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'intentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
    },
    {
        type: 'function',
        name: 'startExecution',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'intentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
    },
    {
        type: 'function',
        name: 'submitProof',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'gpsHash', type: 'bytes32', internalType: 'bytes32' },
            { name: 'photoHash', type: 'bytes32', internalType: 'bytes32' },
        ],
        outputs: [],
    },
    {
        type: 'function',
        name: 'settle',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'intentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [],
    },
    {
        type: 'function',
        name: 'intentCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    },
    {
        type: 'function',
        name: 'getIntent',
        stateMutability: 'view',
        inputs: [{ name: 'intentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                internalType: 'struct IntentMesh.Intent',
                components: [
                    { name: 'id', type: 'uint256', internalType: 'uint256' },
                    { name: 'requesterAgentId', type: 'uint256', internalType: 'uint256' },
                    { name: 'executorAgentId', type: 'uint256', internalType: 'uint256' },
                    { name: 'requester', type: 'address', internalType: 'address' },
                    { name: 'executor', type: 'address', internalType: 'address' },
                    { name: 'title', type: 'string', internalType: 'string' },
                    { name: 'description', type: 'string', internalType: 'string' },
                    { name: 'value', type: 'uint256', internalType: 'uint256' },
                    { name: 'status', type: 'uint8', internalType: 'enum IntentMesh.Status' },
                    { name: 'gpsHash', type: 'bytes32', internalType: 'bytes32' },
                    { name: 'photoHash', type: 'bytes32', internalType: 'bytes32' },
                    { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
                ],
            },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'IntentBroadcasted',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'requesterAgentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'requester', type: 'address', internalType: 'address' },
            { indexed: false, name: 'title', type: 'string', internalType: 'string' },
            { indexed: false, name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'IntentAccepted',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'executorAgentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'executor', type: 'address', internalType: 'address' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'EscrowLocked',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'ExecutionStarted',
        inputs: [{ indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' }],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'ProofSubmitted',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'gpsHash', type: 'bytes32', internalType: 'bytes32' },
            { indexed: false, name: 'photoHash', type: 'bytes32', internalType: 'bytes32' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'SettlementReleased',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'amount', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'executorAgentId', type: 'uint256', internalType: 'uint256' },
        ],
    },
] as const;

export const AGENT_REGISTRY_ABI = [
    {
        type: 'function',
        name: 'getReputation',
        stateMutability: 'view',
        inputs: [{ name: 'agentId', type: 'uint256', internalType: 'uint256' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    },
    {
        type: 'function',
        name: 'getAgentProfile',
        stateMutability: 'view',
        inputs: [{ name: 'wallet', type: 'address', internalType: 'address' }],
        outputs: [
            { name: 'agentId', type: 'uint256', internalType: 'uint256' },
            { name: 'reputation', type: 'uint256', internalType: 'uint256' },
            { name: 'completedIntents', type: 'uint256', internalType: 'uint256' },
            { name: 'totalVolume', type: 'uint256', internalType: 'uint256' },
            { name: 'metadataURI', type: 'string', internalType: 'string' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'SettlementRecorded',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'agentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'value', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'timestamp', type: 'uint256', internalType: 'uint256' },
        ],
    },
] as const;

export const AGENT_FACTORY_ABI = [
    {
        type: 'function',
        name: 'createAgent',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'metadataURI', type: 'string', internalType: 'string' }],
        outputs: [{ name: 'wallet', type: 'address', internalType: 'address' }],
    },
    {
        type: 'function',
        name: 'controllerToWallet',
        stateMutability: 'view',
        inputs: [{ name: '', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'address', internalType: 'address' }],
    },
] as const;

export const AGENT_WALLET_ABI = [
    {
        type: 'function',
        name: 'execute',
        stateMutability: 'payable',
        inputs: [
            { name: 'target', type: 'address', internalType: 'address' },
            { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
        outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    },
] as const;
