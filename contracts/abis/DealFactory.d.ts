import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the createDeal function call.
 */
export type CreateDeal = CallResult<
    {
        dealId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getDealCount function call.
 */
export type GetDealCount = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getRegistry function call.
 */
export type GetRegistry = CallResult<
    {
        registry: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the setRegistry function call.
 */
export type SetRegistry = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IDealFactory
// ------------------------------------------------------------------
export interface IDealFactory extends IOP_NETContract {
    createDeal(deadline: bigint, description: string, recipients: string, percentages: string): Promise<CreateDeal>;
    getDealCount(): Promise<GetDealCount>;
    getRegistry(): Promise<GetRegistry>;
    setRegistry(registry: Address): Promise<SetRegistry>;
}
