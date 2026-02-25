import { NetEvent } from '@btc-vision/btc-runtime/runtime/events/NetEvent';
import { BytesWriter } from '@btc-vision/btc-runtime/runtime/buffer/BytesWriter';
import { ADDRESS_BYTE_LENGTH, U64_BYTE_LENGTH } from '@btc-vision/btc-runtime/runtime/utils';
import { Address } from '@btc-vision/btc-runtime/runtime/types/Address';

@final
export class FactoryDealCreatedEvent extends NetEvent {
    constructor(dealId: u64, dealContract: Address) {
        const data: BytesWriter = new BytesWriter(U64_BYTE_LENGTH + ADDRESS_BYTE_LENGTH);
        data.writeU64(dealId);
        data.writeAddress(dealContract);
        super('FactoryDealCreated', data);
    }
}
