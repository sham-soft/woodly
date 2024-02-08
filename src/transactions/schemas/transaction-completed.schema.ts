import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionCompletedDocument = HydratedDocument<TransactionCompleted>;

@Schema()
export class TransactionCompleted {
    @Prop()
    transactionId: string;

    @Prop()
    paymentId: string;

    @Prop()
    methodId: string;

    @Prop()
    phone: string;

    @Prop()
    recipient: string;

    @Prop()
    name: string;

    @Prop()
    amount: string;

    @Prop()
    paymentTime: string;
}

export const TransactionCompletedSchema = SchemaFactory.createForClass(TransactionCompleted);