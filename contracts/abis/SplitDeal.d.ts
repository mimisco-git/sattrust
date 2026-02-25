import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the releaseFunds function call.
 */
export type ReleaseFunds = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the refund function call.
 */
export type Refund = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the raiseDispute function call.
 */
export type RaiseDispute = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getDeal function call.
 */
export type GetDeal = CallResult<
    {
        dealId: bigint;
        totalAmount: bigint;
        status: number;
        deadline: bigint;
        createdAt: bigint;
        recipientCount: number;
        wasLate: boolean;
        description: string;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getStatus function call.
 */
export type GetStatus = CallResult<
    {
        status: number;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// ISplitDeal
// ------------------------------------------------------------------
export interface ISplitDeal extends IOP_NETContract {
    releaseFunds(): Promise<ReleaseFunds>;
    refund(): Promise<Refund>;
    raiseDispute(): Promise<RaiseDispute>;
    getDeal(): Promise<GetDeal>;
    getStatus(): Promise<GetStatus>;
}
