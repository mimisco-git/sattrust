import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const SplitDealEvents = [];

export const SplitDealAbi = [
    {
        name: 'releaseFunds',
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'refund',
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'raiseDispute',
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getDeal',
        inputs: [],
        outputs: [
            { name: 'dealId', type: ABIDataTypes.UINT256 },
            { name: 'totalAmount', type: ABIDataTypes.UINT256 },
            { name: 'status', type: ABIDataTypes.UINT8 },
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'createdAt', type: ABIDataTypes.UINT64 },
            { name: 'recipientCount', type: ABIDataTypes.UINT32 },
            { name: 'wasLate', type: ABIDataTypes.BOOL },
            { name: 'description', type: ABIDataTypes.STRING },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getStatus',
        inputs: [],
        outputs: [{ name: 'status', type: ABIDataTypes.UINT8 }],
        type: BitcoinAbiTypes.Function,
    },
    ...SplitDealEvents,
    ...OP_NET_ABI,
];

export default SplitDealAbi;
