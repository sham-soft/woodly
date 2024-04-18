import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema()
export class Purchase {
    @Prop()
    purchaseId: number;

    @Prop()
    cashbox: number;

    @Prop()
    paymentSystem: number;

    @Prop()
    bankType: number;

    @Prop()
    amount: string;

    @Prop()
    orderNumber: number;

    @Prop()
    currency: number;

    @Prop()
    cardNumber: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
PurchaseSchema.index({ purchaseId: 1 }, { unique : true });