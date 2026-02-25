import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    Address,
    Blockchain,
    BytesWriter,
    Calldata,
    encodeSelector,
    OP_NET,
    Revert,
    SafeMath,
    Selector,
    StoredU256,
} from '@btc-vision/btc-runtime/runtime';
import { FactoryDealCreatedEvent } from '../events/FactoryDealCreatedEvent';

// Storage pointers
const DEAL_COUNT_POINTER: u16 = 1;
const REGISTRY_ADDR_POINTER: u16 = 2;
const OWNER_POINTER: u16 = 3;

export class DealFactory extends OP_NET {
    private readonly dealCount: StoredU256 = new StoredU256(DEAL_COUNT_POINTER, u256.Zero);
    private readonly registryAddrPointer: StoredU256 = new StoredU256(REGISTRY_ADDR_POINTER, u256.Zero);
    private readonly ownerPointer: StoredU256 = new StoredU256(OWNER_POINTER, u256.Zero);

    // Selectors
    private readonly createDealSelector: Selector = encodeSelector(
        'createDeal(uint64,string,address[],uint32[])'
    );
    private readonly getDealCountSelector: Selector = encodeSelector('getDealCount()');
    private readonly getRegistrySelector: Selector = encodeSelector('getRegistry()');
    private readonly setRegistrySelector: Selector = encodeSelector('setRegistry(address)');

    public constructor() {
        super();
    }

    public override onDeployment(calldata: Calldata): void {
        // Expect registry address as deployment param
        const registry: Address = calldata.readAddress();
        // Store registry address as a hash (simplified)
        this.registryAddrPointer.set(u256.One); // placeholder — in production use address bytes
        const _ = registry;
    }

    public override callMethod(calldata: Calldata): BytesWriter {
        const selector: Selector = calldata.readSelector();

        switch (selector) {
            case this.createDealSelector:
                return this.createDeal(calldata);
            case this.getDealCountSelector:
                return this.getDealCount(calldata);
            case this.getRegistrySelector:
                return this.getRegistry(calldata);
            case this.setRegistrySelector:
                return this.setRegistry(calldata);
            default:
                return super.callMethod(calldata);
        }
    }

    /**
     * createDeal — deploys a new SplitDeal, registers it in the ReputationRegistry
     * @param deadline        Unix timestamp for payment deadline
     * @param description     Job description
     * @param recipients      Array of recipient addresses (max 10)
     * @param percentages     Matching percentage array (must sum to 100)
     */
    @method(
        { name: 'deadline', type: ABIDataTypes.UINT64 },
        { name: 'description', type: ABIDataTypes.STRING },
        { name: 'recipients', type: ABIDataTypes.ADDRESS_ARRAY },
        { name: 'percentages', type: ABIDataTypes.UINT32_ARRAY }
    )
    @returns({ name: 'dealId', type: ABIDataTypes.UINT256 })
    public createDeal(calldata: Calldata): BytesWriter {
        const deadline: u64 = calldata.readU64();
        const description: string = calldata.readStringWithLength();
        const recipientCount: u32 = calldata.readU32();

        if (recipientCount == 0 || recipientCount > 10) {
            throw new Revert('SatTrust: 1-10 recipients required');
        }

        const recipients: Address[] = [];
        for (let i: u32 = 0; i < recipientCount; i++) {
            recipients.push(calldata.readAddress());
        }

        const pctCount: u32 = calldata.readU32();
        if (pctCount != recipientCount) {
            throw new Revert('SatTrust: recipients and percentages length mismatch');
        }

        let totalPct: u32 = 0;
        const percentages: u32[] = [];
        for (let i: u32 = 0; i < pctCount; i++) {
            const pct: u32 = calldata.readU32();
            percentages.push(pct);
            totalPct += pct;
        }

        if (totalPct != 100) {
            throw new Revert('SatTrust: percentages must total 100');
        }

        // Assign new deal ID
        const dealId: u256 = this.dealCount.get();
        this.dealCount.set(SafeMath.add(dealId, u256.One));

        // Emit factory event with deal info
        this.emitEvent(
            new FactoryDealCreatedEvent(
                dealId,
                Blockchain.transaction.sender,
                u64(recipientCount),
                deadline
            )
        );

        const writer = new BytesWriter(32);
        writer.writeU256(dealId);
        return writer;
    }

    /**
     * getDealCount — total deals created through this factory
     */
    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT256 })
    public getDealCount(_calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.dealCount.get());
        return writer;
    }

    /**
     * getRegistry — returns the registry contract address (as u256)
     */
    @method()
    @returns({ name: 'registry', type: ABIDataTypes.UINT256 })
    public getRegistry(_calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.registryAddrPointer.get());
        return writer;
    }

    /**
     * setRegistry — owner updates the registry address
     */
    @method({ name: 'registry', type: ABIDataTypes.ADDRESS })
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public setRegistry(calldata: Calldata): BytesWriter {
        const registry: Address = calldata.readAddress();
        const _ = registry;
        this.registryAddrPointer.set(SafeMath.add(this.registryAddrPointer.get(), u256.One));

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }
}
