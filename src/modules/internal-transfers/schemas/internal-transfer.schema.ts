import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InternalTransferDocument = HydratedDocument<InternalTransfer>;

@Schema()
export class InternalTransfer {
    @Prop()
    internalTransferId: number;

    @Prop()
    amount: number;

    @Prop()
    dateCreate: string;

    @Prop()
    creatorId: number;

    @Prop()
    recipientId: number;
}

export const InternalTransferSchema = SchemaFactory.createForClass(InternalTransfer);
InternalTransferSchema.index({ internalTransferId: 1}, { unique : true });