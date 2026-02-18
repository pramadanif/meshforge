export const INTENT_MESH_ADDRESS = (process.env.NEXT_PUBLIC_INTENT_MESH_ADDRESS ?? '0x7Bd4CBd578a612b6901101aFeBD855FBfa81Ab1b') as `0x${string}`;
export const AGENT_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS ?? '0x32a6F7e395248e9924Cee3CcBaf8dde08Cd13b05') as `0x${string}`;
export const AGENT_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_AGENT_FACTORY_ADDRESS ?? '0xB7c78ceCB25a1c40b3fa3382bAf3F34c9b5bdD66') as `0x${string}`;
export const MESH_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_MESH_VAULT_ADDRESS ?? '0xBE2bcf983b84c030b0C851989aDF351816fA21D2') as `0x${string}`;

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
        name: 'commitMerkleRoot',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'merkleRoot', type: 'bytes32', internalType: 'bytes32' },
            { name: 'step', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [],
    },
    {
        type: 'function',
        name: 'setCrossBorderRoute',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'sourceRegion', type: 'uint256', internalType: 'uint256' },
            { name: 'destinationRegion', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [],
    },
    {
        type: 'function',
        name: 'setCrossBorderStablecoins',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'sourceStable', type: 'string', internalType: 'string' },
            { name: 'destinationStable', type: 'string', internalType: 'string' },
        ],
        outputs: [],
    },
    {
        type: 'function',
        name: 'openDispute',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'reason', type: 'string', internalType: 'string' },
        ],
        outputs: [],
    },
    {
        type: 'function',
        name: 'verifyOffchainStep',
        stateMutability: 'view',
        inputs: [
            { name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { name: 'leaf', type: 'bytes32', internalType: 'bytes32' },
            { name: 'proof', type: 'bytes32[]', internalType: 'bytes32[]' },
            { name: 'step', type: 'uint256', internalType: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
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
                    { name: 'offchainMerkleRoot', type: 'bytes32', internalType: 'bytes32' },
                    { name: 'disputed', type: 'bool', internalType: 'bool' },
                    { name: 'fallbackResolved', type: 'bool', internalType: 'bool' },
                    { name: 'sourceRegion', type: 'uint256', internalType: 'uint256' },
                    { name: 'destinationRegion', type: 'uint256', internalType: 'uint256' },
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
        name: 'MerkleRootCommitted',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'merkleRoot', type: 'bytes32', internalType: 'bytes32' },
            { indexed: true, name: 'step', type: 'uint256', internalType: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'OffchainStepVerified',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'leaf', type: 'bytes32', internalType: 'bytes32' },
            { indexed: true, name: 'step', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'valid', type: 'bool', internalType: 'bool' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'DisputeOpened',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'challengerAgentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'amount', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'reason', type: 'string', internalType: 'string' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'DisputeResolved',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'approved', type: 'bool', internalType: 'bool' },
            { indexed: false, name: 'penaltyPoints', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'evidenceRef', type: 'string', internalType: 'string' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'CrossBorderRouteSet',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'sourceRegion', type: 'uint256', internalType: 'uint256' },
            { indexed: true, name: 'destinationRegion', type: 'uint256', internalType: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        name: 'CrossBorderStablecoinsSet',
        inputs: [
            { indexed: true, name: 'intentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'sourceStable', type: 'string', internalType: 'string' },
            { indexed: false, name: 'destinationStable', type: 'string', internalType: 'string' },
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
        type: 'function',
        name: 'penaltyPoints',
        stateMutability: 'view',
        inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
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
    {
        type: 'event',
        anonymous: false,
        name: 'ReputationPenalized',
        inputs: [
            { indexed: true, name: 'agentId', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'penaltyPoints', type: 'uint256', internalType: 'uint256' },
            { indexed: false, name: 'reason', type: 'string', internalType: 'string' },
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
