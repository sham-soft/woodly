import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Card } from '../../cards/schemas/card.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

// @Schema({ timestamps: true })
@Schema()
export class Transaction {
    @Prop()
    transactionId: number;
    
    @Prop()
    amount: number;

    @Prop()
    commission: number;

    @Prop()
    amountMinusCommission: number;

    @Prop()
    status: number;

    @Prop()
    dateCreate: string;

    @Prop()
    dateActivate: string;

    @Prop()
    dateClose: string;

    @Prop()
    paymentSystem: number;

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

    @Prop({ type: Card })
    card: {
        title: string,
        cardId: number,
        cardNumber: string,
        phone: string,
        recipient: string,
        fio: string,
        bankType: number,
        cardLastNumber: string,
        userId: number,
    };
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ transactionId: 1 }, { unique : true });
// TransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });