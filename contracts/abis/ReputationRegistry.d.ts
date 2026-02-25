import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the recordCompletion function call.
 */
export type RecordCompletion = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the recordDispute function call.
 */
export type RecordDispute = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getReputation function call.
 */
export type GetReputation = CallResult<
    {
        dealsCompleted: bigint;
        dealsAsPayer: bigint;
        totalReceived: bigint;
        totalPaid: bigint;
        disputes: bigint;
        lateReleases: bigint;
        uniquePayers: bigint;
        firstActivity: bigint;
        lastActivity: bigint;
        score: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getScore function call.
 */
export type GetScore = CallResult<
    {
        score: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getTotalWallets function call.
 */
export type GetTotalWallets = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the allowlistFactory function call.
 */
export type AllowlistFactory = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the isAllowlisted function call.
 */
export type IsAllowlisted = CallResult<
    {
        result: boolean;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IReputationRegistry
// ------------------------------------------------------------------
export interface IReputationRegistry extends IOP_NETContract {
    recordCompletion(
        payer: Address,
        recipients: string,
        amounts: string,
        wasLate: boolean,
        wasDisputed: boolean,
    ): Promise<RecordCompletion>;
    recordDispute(payer: Address, recipient: Address): Promise<RecordDispute>;
    getReputation(wallet: Address): Promise<GetReputation>;
    getScore(wallet: Address): Promise<GetScore>;
    getTotalWallets(): Promise<GetTotalWallets>;
    allowlistFactory(factory: Address): Promise<AllowlistFactory>;
    isAllowlisted(factory: Address): Promise<IsAllowlisted>;
}
