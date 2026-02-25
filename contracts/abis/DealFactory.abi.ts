import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const DealFactoryEvents = [];

export const DealFactoryAbi = [
    {
        name: 'createDeal',
        inputs: [
            { name: 'deadline', type: ABIDataTypes.UINT64 },
            { name: 'description', type: ABIDataTypes.STRING },
            { name: 'recipients', type: ABIDataTypes.STRING },
            { name: 'percentages', type: ABIDataTypes.STRING },
        ],
        outputs: [{ name: 'dealId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getDealCount',
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getRegistry',
        inputs: [],
        outputs: [{ name: 'registry', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'setRegistry',
        inputs: [{ name: 'registry', type: ABIDataTypes.ADDRESS }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    ...DealFactoryEvents,
    ...OP_NET_ABI,
];

export default DealFactoryAbi;
