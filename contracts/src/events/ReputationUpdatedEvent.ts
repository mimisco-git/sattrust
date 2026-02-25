import { NetEvent } from '@btc-vision/btc-runtime/runtime/events/NetEvent';
import { BytesWriter } from '@btc-vision/btc-runtime/runtime/buffer/BytesWriter';
import { ADDRESS_BYTE_LENGTH } from '@btc-vision/btc-runtime/runtime/utils';
import { Address } from '@btc-vision/btc-runtime/runtime/types/Address';

@final
export class ReputationUpdatedEvent extends NetEvent {
    constructor(wallet: Address, score: u32) {
        const data: BytesWriter = new BytesWriter(ADDRESS_BYTE_LENGTH + 4);
        data.writeAddress(wallet);
        data.writeU32(score);
        super('ReputationUpdated', data);
    }
}
