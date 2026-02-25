import { NetEvent } from '@btc-vision/btc-runtime/runtime/events/NetEvent';
import { BytesWriter } from '@btc-vision/btc-runtime/runtime/buffer/BytesWriter';
import { U64_BYTE_LENGTH } from '@btc-vision/btc-runtime/runtime/utils';

@final
export class DealReleasedEvent extends NetEvent {
    constructor(dealId: u64, isLate: bool) {
        const data: BytesWriter = new BytesWriter(U64_BYTE_LENGTH + 1);
        data.writeU64(dealId);
        data.writeBoolean(isLate);
        super('DealReleased', data);
    }
}
