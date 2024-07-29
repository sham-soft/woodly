import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WithdrawalDocument = HydratedDocument<Withdrawal>;

@Schema()
export class Withdrawal {
    @Prop()
    withdrawalId: number;

    @Prop()
    status: number;

    @Prop()
    address: string;

    @Prop()
    amount: number;

    @Prop()
    amountWithPercent: number;

    @Prop()
    dateCreate: string;

    @Prop()
    dateClose: string;

    @Prop()
    creatorId: number;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
WithdrawalSchema.index({ withdrawalId: 1}, { unique : true });