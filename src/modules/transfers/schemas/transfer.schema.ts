import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TransferDocument = HydratedDocument<Transfer>;

@Schema()
export class Transfer {
    @Prop()
    transferId: number;

    @Prop()
    hashId: string;

    @Prop()
    rate: number;

    @Prop()
    amount: number;

    @Prop()
    dateCreate: string;

    @Prop()
    creatorId: number;

    @Prop()
    address: string;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
TransferSchema.index({ transferId: 1}, { unique : true });