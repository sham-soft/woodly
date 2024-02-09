import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;

@Schema()
export class TransactionHistory {
    @Prop()
    transactionId: string;

    @Prop()
    paymentId: string;

    @Prop()
    amount: string;

    @Prop()
    paymentTime: string;
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);