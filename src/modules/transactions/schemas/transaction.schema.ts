import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

// @Schema({ timestamps: true })
@Schema()
export class Transaction {
    @Prop()
    transactionId: number;
    
    @Prop()
    amount: number;

    @Prop()
    status: number;

    @Prop()
    dateCreate: string;

    @Prop()
    dateClose: string;

    @Prop()
    title: string;

    @Prop()
    cardId: number;

    @Prop()
    cardNumber: string;

    @Prop()
    phone: string;

    @Prop()
    recipient: string;

    @Prop()
    fio: string;

    @Prop()
    bankType: number;

    @Prop()
    cardLastNumber: string;

    @Prop()
    paymentTime: string;

    @Prop()
    message: string;

    @Prop()
    orderNumber: number;

    @Prop()
    cashbox: number;

    @Prop()
    clientNumber: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ transactionId: 1 }, { unique : true });
// TransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });