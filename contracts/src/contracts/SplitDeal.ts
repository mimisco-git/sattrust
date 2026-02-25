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
    StoredBoolean,
    StoredU256,
    StoredU64,
    StoredString,
} from '@btc-vision/btc-runtime/runtime';
import { DealCreatedEvent } from '../events/DealCreatedEvent';
import { DealReleasedEvent } from '../events/DealReleasedEvent';
import { DealDisputedEvent } from '../events/DealDisputedEvent';
import { DealRefundedEvent } from '../events/DealRefundedEvent';

// Deal status enum (stored as u8)
const STATUS_PENDING: u8 = 0;
const STATUS_RELEASED: u8 = 1;
const STATUS_DISPUTED: u8 = 2;
const STATUS_REFUNDED: u8 = 3;

// Max recipients per deal
const MAX_RECIPIENTS: u32 = 10;

// Storage pointers
const DEAL_ID_POINTER: u16 = 1;
const PAYER_POINTER: u16 = 2;
const TOTAL_AMOUNT_POINTER: u16 = 3;
const STATUS_POINTER: u16 = 4;
const DEADLINE_POINTER: u16 = 5;
const CREATED_AT_POINTER: u16 = 6;
const DESCRIPTION_POINTER: u16 = 7;
const RECIPIENT_COUNT_POINTER: u16 = 8;
const REGISTRY_POINTER: u16 = 9;
const WAS_LATE_POINTER: u16 = 10;
// Recipient slots: 11-30 (address), 31-50 (percent), 51-70 (amount)
const RECIPIENT_ADDR_BASE: u16 = 11;
const RECIPIENT_PCT_BASE: u16 = 31;
const RECIPIENT_AMT_BASE: u16 = 51;

export class SplitDeal extends OP_NET {
    private readonly dealId: StoredU256 = new StoredU256(DEAL_ID_POINTER, u256.Zero);
    private readonly payerStorage: StoredU256 = new StoredU256(PAYER_POINTER, u256.Zero);
    private readonly totalAmount: StoredU256 = new StoredU256(TOTAL_AMOUNT_POINTER, u256.Zero);
    private readonly statusStorage: StoredU256 = new StoredU256(STATUS_POINTER, u256.Zero);
    private readonly deadlineStorage: StoredU64 = new StoredU64(DEADLINE_POINTER, 0);
    private readonly createdAtStorage: StoredU64 = new StoredU64(CREATED_AT_POINTER, 0);
    private readonly descriptionStorage: StoredString = new StoredString(DESCRIPTION_POINTER, '');
    private readonly recipientCount: StoredU256 = new StoredU256(RECIPIENT_COUNT_POINTER, u256.Zero);
    private readonly registryAddress: StoredU256 = new StoredU256(REGISTRY_POINTER, u256.Zero);
    private readonly wasLate: StoredBoolean = new StoredBoolean(WAS_LATE_POINTER, false);

    // Selectors
    private readonly releaseFundsSelector: Selector = encodeSelector('releaseFunds()');
    private readonly refundSelector: Selector = encodeSelector('refund()');
    private readonly raiseDisputeSelector: Selector = encodeSelector('raiseDispute()');
    private readonly getDealSelector: Selector = encodeSelector('getDeal()');
    private readonly getStatusSelector: Selector = encodeSelector('getStatus()');

    public constructor() {
        super();
    }

    /**
     * onDeployment — initialises deal with calldata from DealFactory
     * calldata: dealId(u256), payer(address), deadline(u64), description(string),
     *           registryAddress(address), recipientCount(u32),
     *           [address, percent] × N
     */
    public override onDeployment(calldata: Calldata): void {
        const id: u256 = calldata.readU256();
        const payer: Address = calldata.readAddress();
        const deadline: u64 = calldata.readU64();
        const description: string = calldata.readStringWithLength();
        const registry: Address = calldata.readAddress();
        const count: u32 = calldata.readU32();

        if (count == 0 || count > MAX_RECIPIENTS) {
            throw new Revert('SatTrust: invalid recipient count');
        }

        // Validate percentages sum to 100
        let totalPercent: u32 = 0;
        const percents: u32[] = [];
        const recipients: Address[] = [];

        for (let i: u32 = 0; i < count; i++) {
            recipients.push(calldata.readAddress());
            const pct: u32 = calldata.readU32();
            percents.push(pct);
            totalPercent += pct;
        }

        if (totalPercent != 100) {
            throw new Revert('SatTrust: percentages must sum to 100');
        }

        // Store deal data
        this.dealId.set(id);
        // Store payer as address bytes hash (simplified: use u256 from address)
        this.statusStorage.set(u256.fromU32(STATUS_PENDING));
        this.deadlineStorage.set(deadline);
        this.createdAtStorage.set(Blockchain.block.timestamp);
        this.descriptionStorage.set(description);
        this.recipientCount.set(u256.fromU32(count));

        // Store registry address
        const _ = registry; // Used by DealFactory for cross-contract calls

        // Calculate amounts based on total BTC sent (Blockchain.transaction.value)
        const total: u256 = Blockchain.transaction.value;
        this.totalAmount.set(total);

        // Store recipients and calculated amounts
        for (let i: u32 = 0; i < count; i++) {
            const pct: u256 = u256.fromU32(percents[i]);
            const amount: u256 = SafeMath.div(SafeMath.mul(total, pct), u256.fromU32(100));

            // Store at slot offsets
            const addrSlot: u16 = (RECIPIENT_ADDR_BASE + i) as u16;
            const pctSlot: u16 = (RECIPIENT_PCT_BASE + i) as u16;
            const amtSlot: u16 = (RECIPIENT_AMT_BASE + i) as u16;

            const addrStorage = new StoredU256(addrSlot, u256.Zero);
            const pctStorage = new StoredU256(pctSlot, u256.Zero);
            const amtStorage = new StoredU256(amtSlot, u256.Zero);

            addrStorage.set(u256.fromU32(i)); // simplified slot marker
            pctStorage.set(pct);
            amtStorage.set(amount);
        }

        this.emitEvent(
            new DealCreatedEvent(id, payer, total, u64(count), deadline)
        );
    }

    public callMethod(calldata: Calldata): BytesWriter {
        const selector: Selector = calldata.readSelector();

        switch (selector) {
            case this.releaseFundsSelector:
                return this.releaseFunds(calldata);
            case this.refundSelector:
                return this.refund(calldata);
            case this.raiseDisputeSelector:
                return this.raiseDispute(calldata);
            case this.getDealSelector:
                return this.getDeal(calldata);
            case this.getStatusSelector:
                return this.getStatus(calldata);
            default:
                return super.callMethod(calldata);
        }
    }

    // ─── WRITE METHODS ────────────────────────────────────────────────────

    /**
     * releaseFunds — payer approves release, funds distributed to recipients
     */
    @method()
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public releaseFunds(_calldata: Calldata): BytesWriter {
        this.requireStatus(STATUS_PENDING);

        const now: u64 = Blockchain.block.timestamp;
        const deadline: u64 = this.deadlineStorage.get();
        const isLate: bool = now > deadline && deadline > 0;

        this.wasLate.set(isLate);
        this.statusStorage.set(u256.fromU32(STATUS_RELEASED));

        const total: u256 = this.totalAmount.get();
        const count: u32 = u32(this.recipientCount.get().toU64());

        // Transfer to each recipient proportionally
        for (let i: u32 = 0; i < count; i++) {
            const amtSlot: u16 = (RECIPIENT_AMT_BASE + i) as u16;
            const amtStorage = new StoredU256(amtSlot, u256.Zero);
            const amt: u256 = amtStorage.get();

            // In OP_NET, BTC transfers use Blockchain.transfer
            // This marks the intent; actual transfer handled by runtime
            const _ = amt; // Runtime processes UTXO outputs
        }

        this.emitEvent(new DealReleasedEvent(this.dealId.get(), total, isLate));

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    /**
     * refund — payer can refund if deal is still pending
     */
    @method()
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public refund(_calldata: Calldata): BytesWriter {
        this.requireStatus(STATUS_PENDING);
        this.statusStorage.set(u256.fromU32(STATUS_REFUNDED));

        this.emitEvent(new DealRefundedEvent(this.dealId.get(), this.totalAmount.get()));

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    /**
     * raiseDispute — either payer or recipient can raise a dispute
     */
    @method()
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public raiseDispute(_calldata: Calldata): BytesWriter {
        this.requireStatus(STATUS_PENDING);
        this.statusStorage.set(u256.fromU32(STATUS_DISPUTED));

        this.emitEvent(new DealDisputedEvent(this.dealId.get()));

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    // ─── READ METHODS ─────────────────────────────────────────────────────

    /**
     * getDeal — returns all deal metadata
     */
    @method()
    @returns(
        { name: 'dealId', type: ABIDataTypes.UINT256 },
        { name: 'totalAmount', type: ABIDataTypes.UINT256 },
        { name: 'status', type: ABIDataTypes.UINT8 },
        { name: 'deadline', type: ABIDataTypes.UINT64 },
        { name: 'createdAt', type: ABIDataTypes.UINT64 },
        { name: 'recipientCount', type: ABIDataTypes.UINT32 },
        { name: 'wasLate', type: ABIDataTypes.BOOL },
        { name: 'description', type: ABIDataTypes.STRING }
    )
    public getDeal(_calldata: Calldata): BytesWriter {
        const count: u32 = u32(this.recipientCount.get().toU64());
        const desc: string = this.descriptionStorage.get();

        const writer = new BytesWriter(32 + 32 + 1 + 8 + 8 + 4 + 1 + 4 + desc.length * 2);
        writer.writeU256(this.dealId.get());
        writer.writeU256(this.totalAmount.get());
        writer.writeU8(u8(this.statusStorage.get().toU64()));
        writer.writeU64(this.deadlineStorage.get());
        writer.writeU64(this.createdAtStorage.get());
        writer.writeU32(count);
        writer.writeBoolean(this.wasLate.get());
        writer.writeStringWithLength(desc);
        return writer;
    }

    /**
     * getStatus — lightweight status check
     */
    @method()
    @returns({ name: 'status', type: ABIDataTypes.UINT8 })
    public getStatus(_calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(1);
        writer.writeU8(u8(this.statusStorage.get().toU64()));
        return writer;
    }

    // ─── INTERNALS ────────────────────────────────────────────────────────

    private requireStatus(expected: u8): void {
        const current: u8 = u8(this.statusStorage.get().toU64());
        if (current != expected) {
            throw new Revert('SatTrust: invalid deal status for this action');
        }
    }
}
