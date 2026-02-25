import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const ReputationRegistryEvents = [];

export const ReputationRegistryAbi = [
    {
        name: 'recordCompletion',
        inputs: [
            { name: 'payer', type: ABIDataTypes.ADDRESS },
            { name: 'recipients', type: ABIDataTypes.STRING },
            { name: 'amounts', type: ABIDataTypes.STRING },
            { name: 'wasLate', type: ABIDataTypes.BOOL },
            { name: 'wasDisputed', type: ABIDataTypes.BOOL },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'recordDispute',
        inputs: [
            { name: 'payer', type: ABIDataTypes.ADDRESS },
            { name: 'recipient', type: ABIDataTypes.ADDRESS },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getReputation',
        inputs: [{ name: 'wallet', type: ABIDataTypes.ADDRESS }],
        outputs: [
            { name: 'dealsCompleted', type: ABIDataTypes.UINT256 },
            { name: 'dealsAsPayer', type: ABIDataTypes.UINT256 },
            { name: 'totalReceived', type: ABIDataTypes.UINT256 },
            { name: 'totalPaid', type: ABIDataTypes.UINT256 },
            { name: 'disputes', type: ABIDataTypes.UINT256 },
            { name: 'lateReleases', type: ABIDataTypes.UINT256 },
            { name: 'uniquePayers', type: ABIDataTypes.UINT256 },
            { name: 'firstActivity', type: ABIDataTypes.UINT64 },
            { name: 'lastActivity', type: ABIDataTypes.UINT64 },
            { name: 'score', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getScore',
        inputs: [{ name: 'wallet', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'score', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getTotalWallets',
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'allowlistFactory',
        inputs: [{ name: 'factory', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'isAllowlisted',
        inputs: [{ name: 'factory', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'result', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    ...ReputationRegistryEvents,
    ...OP_NET_ABI,
];

export default ReputationRegistryAbi;
