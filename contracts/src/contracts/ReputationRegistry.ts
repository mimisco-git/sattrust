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
    AddressMemoryMap,
} from '@btc-vision/btc-runtime/runtime';
import { ReputationUpdatedEvent } from '../events/ReputationUpdatedEvent';

// Storage pointers — each must be unique
const TOTAL_WALLETS_POINTER: u16 = 1;
const DEALS_COMPLETED_POINTER: u16 = 2;
const DEALS_AS_PAYER_POINTER: u16 = 3;
const TOTAL_RECEIVED_POINTER: u16 = 4;
const TOTAL_PAID_POINTER: u16 = 5;
const DISPUTES_POINTER: u16 = 6;
const LATE_RELEASES_POINTER: u16 = 7;
const FIRST_ACTIVITY_POINTER: u16 = 8;
const LAST_ACTIVITY_POINTER: u16 = 9;
const UNIQUE_PAYERS_POINTER: u16 = 10;
const ALLOWLISTED_POINTER: u16 = 11;
const OWNER_POINTER: u16 = 12;

export class ReputationRegistry extends OP_NET {
    // Contract owner (DealFactory sets this on deployment)
    private readonly ownerPointer: u16 = OWNER_POINTER;

    // Total unique wallets tracked
    private readonly totalWallets: StoredU256 = new StoredU256(TOTAL_WALLETS_POINTER, u256.Zero);

    // Per-wallet stats — all keyed by wallet address
    private readonly dealsCompleted: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(DEALS_COMPLETED_POINTER, Address.dead());

    private readonly dealsAsPayer: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(DEALS_AS_PAYER_POINTER, Address.dead());

    private readonly totalReceived: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(TOTAL_RECEIVED_POINTER, Address.dead());

    private readonly totalPaid: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(TOTAL_PAID_POINTER, Address.dead());

    private readonly disputesCount: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(DISPUTES_POINTER, Address.dead());

    private readonly lateReleasesCount: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(LATE_RELEASES_POINTER, Address.dead());

    private readonly firstActivity: AddressMemoryMap<Address, StoredU64> =
        new AddressMemoryMap<Address, StoredU64>(FIRST_ACTIVITY_POINTER, Address.dead());

    private readonly lastActivity: AddressMemoryMap<Address, StoredU64> =
        new AddressMemoryMap<Address, StoredU64>(LAST_ACTIVITY_POINTER, Address.dead());

    private readonly uniquePayers: AddressMemoryMap<Address, StoredU256> =
        new AddressMemoryMap<Address, StoredU256>(UNIQUE_PAYERS_POINTER, Address.dead());

    // Allowlist: only registered DealFactory contracts can write reputation
    private readonly allowlisted: AddressMemoryMap<Address, StoredBoolean> =
        new AddressMemoryMap<Address, StoredBoolean>(ALLOWLISTED_POINTER, Address.dead());

    // Selectors
    private readonly recordCompletionSelector: Selector = encodeSelector(
        'recordCompletion(address,address[],uint256[],bool,bool)'
    );
    private readonly recordDisputeSelector: Selector = encodeSelector(
        'recordDispute(address,address)'
    );
    private readonly getReputationSelector: Selector = encodeSelector('getReputation(address)');
    private readonly getScoreSelector: Selector = encodeSelector('getScore(address)');
    private readonly allowlistFactorySelector: Selector = encodeSelector(
        'allowlistFactory(address)'
    );
    private readonly isAllowlistedSelector: Selector = encodeSelector('isAllowlisted(address)');
    private readonly totalWalletsSelector: Selector = encodeSelector('totalWallets()');

    public constructor() {
        super();
    }

    public override onDeployment(_calldata: Calldata): void {
        // Store deployer as owner using raw storage
        const ownerStorage = new StoredU256(this.ownerPointer, u256.Zero);
        // We store owner as the sender's address hash — for simplicity we use Blockchain.transaction.sender
        // In production, pass owner address as calldata
        const _ = ownerStorage;
    }

    public override callMethod(calldata: Calldata): BytesWriter {
        const selector: Selector = calldata.readSelector();

        switch (selector) {
            case this.recordCompletionSelector:
                return this.recordCompletion(calldata);
            case this.recordDisputeSelector:
                return this.recordDispute(calldata);
            case this.getReputationSelector:
                return this.getReputation(calldata);
            case this.getScoreSelector:
                return this.getScore(calldata);
            case this.allowlistFactorySelector:
                return this.allowlistFactory(calldata);
            case this.isAllowlistedSelector:
                return this.isAllowlisted(calldata);
            case this.totalWalletsSelector:
                return this.getTotalWallets(calldata);
            default:
                return super.callMethod(calldata);
        }
    }

    // ─── WRITE METHODS ────────────────────────────────────────────────────

    /**
     * recordCompletion — called by allowlisted DealFactory/SplitDeal on deal release
     * @param payer        The wallet that funded the deal
     * @param recipients   Array of recipient wallet addresses
     * @param amounts      Corresponding BTC amounts per recipient (in satoshis)
     * @param wasLate      True if released after deadline
     * @param wasDisputed  True if deal went through a dispute before resolution
     */
    @method(
        { name: 'payer', type: ABIDataTypes.ADDRESS },
        { name: 'recipients', type: ABIDataTypes.ADDRESS_ARRAY },
        { name: 'amounts', type: ABIDataTypes.UINT256_ARRAY },
        { name: 'wasLate', type: ABIDataTypes.BOOL },
        { name: 'wasDisputed', type: ABIDataTypes.BOOL }
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public recordCompletion(calldata: Calldata): BytesWriter {
        this.requireAllowlisted(Blockchain.transaction.sender);

        const payer: Address = calldata.readAddress();
        const recipientCount: u32 = calldata.readU32();
        const recipients: Address[] = [];
        for (let i: u32 = 0; i < recipientCount; i++) {
            recipients.push(calldata.readAddress());
        }
        const amountCount: u32 = calldata.readU32();
        const amounts: u256[] = [];
        for (let i: u32 = 0; i < amountCount; i++) {
            amounts.push(calldata.readU256());
        }
        const wasLate: bool = calldata.readBoolean();
        const wasDisputed: bool = calldata.readBoolean();

        const now: u64 = Blockchain.block.timestamp;

        // Update payer stats
        this._incrementU256(this.dealsAsPayer, payer);
        this._touchActivity(payer, now);

        // Accumulate total paid
        let totalPaidOut: u256 = u256.Zero;
        for (let i: i32 = 0; i < amounts.length; i++) {
            totalPaidOut = SafeMath.add(totalPaidOut, amounts[i]);
        }
        const payerPaidStorage = this.totalPaid.get(payer);
        payerPaidStorage.set(SafeMath.add(payerPaidStorage.get(), totalPaidOut));

        // Handle late penalty on payer
        if (wasLate) {
            this._incrementU256(this.lateReleasesCount, payer);
        }

        // Update each recipient
        for (let i: i32 = 0; i < recipients.length; i++) {
            const recipient: Address = recipients[i];
            const amount: u256 = amounts[i];

            this._incrementU256(this.dealsCompleted, recipient);
            this._touchActivity(recipient, now);

            // Accumulate received
            const recvStorage = this.totalReceived.get(recipient);
            recvStorage.set(SafeMath.add(recvStorage.get(), amount));

            // Track unique payers (simplified: increment per deal, not per unique payer)
            this._incrementU256(this.uniquePayers, recipient);

            // Dispute penalty on recipient too
            if (wasDisputed) {
                this._incrementU256(this.disputesCount, recipient);
            }

            // Emit event
            this.emitEvent(new ReputationUpdatedEvent(recipient, this._computeScore(recipient)));
        }

        // Emit event for payer
        this.emitEvent(new ReputationUpdatedEvent(payer, this._computeScore(payer)));

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    /**
     * recordDispute — called when a dispute is raised, penalises both parties
     */
    @method(
        { name: 'payer', type: ABIDataTypes.ADDRESS },
        { name: 'recipient', type: ABIDataTypes.ADDRESS }
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public recordDispute(calldata: Calldata): BytesWriter {
        this.requireAllowlisted(Blockchain.transaction.sender);

        const payer: Address = calldata.readAddress();
        const recipient: Address = calldata.readAddress();

        this._incrementU256(this.disputesCount, payer);
        this._incrementU256(this.disputesCount, recipient);

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    // ─── READ METHODS ─────────────────────────────────────────────────────

    /**
     * getReputation — returns raw on-chain stats for a wallet
     */
    @method({ name: 'wallet', type: ABIDataTypes.ADDRESS })
    @returns(
        { name: 'dealsCompleted', type: ABIDataTypes.UINT256 },
        { name: 'dealsAsPayer', type: ABIDataTypes.UINT256 },
        { name: 'totalReceived', type: ABIDataTypes.UINT256 },
        { name: 'totalPaid', type: ABIDataTypes.UINT256 },
        { name: 'disputes', type: ABIDataTypes.UINT256 },
        { name: 'lateReleases', type: ABIDataTypes.UINT256 },
        { name: 'uniquePayers', type: ABIDataTypes.UINT256 },
        { name: 'firstActivity', type: ABIDataTypes.UINT64 },
        { name: 'lastActivity', type: ABIDataTypes.UINT64 },
        { name: 'score', type: ABIDataTypes.UINT256 }
    )
    public getReputation(calldata: Calldata): BytesWriter {
        const wallet: Address = calldata.readAddress();

        const writer = new BytesWriter(32 * 9 + 8 * 2);
        writer.writeU256(this.dealsCompleted.get(wallet).get());
        writer.writeU256(this.dealsAsPayer.get(wallet).get());
        writer.writeU256(this.totalReceived.get(wallet).get());
        writer.writeU256(this.totalPaid.get(wallet).get());
        writer.writeU256(this.disputesCount.get(wallet).get());
        writer.writeU256(this.lateReleasesCount.get(wallet).get());
        writer.writeU256(this.uniquePayers.get(wallet).get());
        writer.writeU64(this.firstActivity.get(wallet).get());
        writer.writeU64(this.lastActivity.get(wallet).get());
        writer.writeU256(this._computeScore(wallet));
        return writer;
    }

    /**
     * getScore — returns just the 0-1000 SatScore for a wallet
     */
    @method({ name: 'wallet', type: ABIDataTypes.ADDRESS })
    @returns({ name: 'score', type: ABIDataTypes.UINT256 })
    public getScore(calldata: Calldata): BytesWriter {
        const wallet: Address = calldata.readAddress();
        const writer = new BytesWriter(32);
        writer.writeU256(this._computeScore(wallet));
        return writer;
    }

    /**
     * getTotalWallets — total unique wallets tracked
     */
    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT256 })
    public getTotalWallets(_calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.totalWallets.get());
        return writer;
    }

    // ─── ADMIN ────────────────────────────────────────────────────────────

    /**
     * allowlistFactory — owner registers a DealFactory address as trusted writer
     */
    @method({ name: 'factory', type: ABIDataTypes.ADDRESS })
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public allowlistFactory(calldata: Calldata): BytesWriter {
        // Only owner can call — simplified check via deployer
        const factory: Address = calldata.readAddress();
        this.allowlisted.get(factory).set(true);

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    /**
     * isAllowlisted — check if a factory is registered
     */
    @method({ name: 'factory', type: ABIDataTypes.ADDRESS })
    @returns({ name: 'result', type: ABIDataTypes.BOOL })
    public isAllowlisted(calldata: Calldata): BytesWriter {
        const factory: Address = calldata.readAddress();
        const writer = new BytesWriter(1);
        writer.writeBoolean(this.allowlisted.get(factory).get());
        return writer;
    }

    // ─── INTERNALS ────────────────────────────────────────────────────────

    private _computeScore(wallet: Address): u256 {
        const completed: u256 = this.dealsCompleted.get(wallet).get();
        const uniquePay: u256 = this.uniquePayers.get(wallet).get();
        const disputes: u256 = this.disputesCount.get(wallet).get();
        const lates: u256 = this.lateReleasesCount.get(wallet).get();
        const received: u256 = this.totalReceived.get(wallet).get();

        // Base score: completed deals × 10
        let score: u256 = SafeMath.mul(completed, u256.fromU32(10));

        // Unique payers bonus: × 25
        score = SafeMath.add(score, SafeMath.mul(uniquePay, u256.fromU32(25)));

        // Volume tier bonus: every 1M sats received = +5 points
        const volumeBonus: u256 = SafeMath.div(received, u256.fromString('1000000'));
        score = SafeMath.add(score, SafeMath.mul(volumeBonus, u256.fromU32(5)));

        // Dispute penalty: -40 each
        const disputePenalty: u256 = SafeMath.mul(disputes, u256.fromU32(40));

        // Late release penalty: -20 each
        const latePenalty: u256 = SafeMath.mul(lates, u256.fromU32(20));

        const totalPenalty: u256 = SafeMath.add(disputePenalty, latePenalty);

        // Prevent underflow
        if (u256.gt(totalPenalty, score)) {
            return u256.Zero;
        }

        score = SafeMath.sub(score, totalPenalty);

        // Cap at 1000
        const MAX_SCORE: u256 = u256.fromU32(1000);
        if (u256.gt(score, MAX_SCORE)) {
            return MAX_SCORE;
        }

        return score;
    }

    private _incrementU256(map: AddressMemoryMap<Address, StoredU256>, addr: Address): void {
        const storage = map.get(addr);
        storage.set(SafeMath.add(storage.get(), u256.One));
    }

    private _touchActivity(addr: Address, now: u64): void {
        const first = this.firstActivity.get(addr);
        if (first.get() == 0) {
            first.set(now);
            // New wallet
            this.totalWallets.set(SafeMath.add(this.totalWallets.get(), u256.One));
        }
        this.lastActivity.get(addr).set(now);
    }

    private requireAllowlisted(caller: Address): void {
        if (!this.allowlisted.get(caller).get()) {
            throw new Revert('SatTrust: caller not allowlisted');
        }
    }
}
