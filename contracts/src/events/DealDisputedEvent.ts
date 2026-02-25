import { NetEvent } from '@btc-vision/btc-runtime/runtime/events/NetEvent';
import { BytesWriter } from '@btc-vision/btc-runtime/runtime/buffer/BytesWriter';
import { U64_BYTE_LENGTH } from '@btc-vision/btc-runtime/runtime/utils';

@final
export class DealDisputedEvent extends NetEvent {
    constructor(dealId: u64) {
        const data: BytesWriter = new BytesWriter(U64_BYTE_LENGTH);
        data.writeU64(dealId);
        super('DealDisputed', data);
    }
}
