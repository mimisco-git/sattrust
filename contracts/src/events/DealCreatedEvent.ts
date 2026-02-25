import { NetEvent } from '@btc-vision/btc-runtime/runtime/events/NetEvent';
import { BytesWriter } from '@btc-vision/btc-runtime/runtime/buffer/BytesWriter';
import { ADDRESS_BYTE_LENGTH, U256_BYTE_LENGTH, U64_BYTE_LENGTH } from '@btc-vision/btc-runtime/runtime/utils';
import { Address } from '@btc-vision/btc-runtime/runtime/types/Address';
import { u256 } from '@btc-vision/as-bignum/assembly';

@final
export class DealCreatedEvent extends NetEvent {
    constructor(dealId: u64, payer: Address, amount: u256) {
        const data: BytesWriter = new BytesWriter(U64_BYTE_LENGTH + ADDRESS_BYTE_LENGTH + U256_BYTE_LENGTH);
        data.writeU64(dealId);
        data.writeAddress(payer);
        data.writeU256(amount);
        super('DealCreated', data);
    }
}
