import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Cashbox } from '../../cashboxes/schemas/cashbox.schema';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema()
export class Purchase {
    @Prop()
    purchaseId: number;

    @Prop()
    paymentSystem: number;

    @Prop()
    bankType: number;

    @Prop()
    amount: number;

    @Prop()
    orderNumber: number;

    @Prop()
    currency: string;

    @Prop()
    requisites: string;

    @Prop()
    status: number;

    @Prop()
    dateCreate: string;

    @Prop()
    dateClose: string;

    @Prop()
    debit: number;

    @Prop()
    receipt: string;

    @Prop({ type: Cashbox })
    cashbox: {
        cashboxId: number,
        creatorId: number,
    };

    @Prop()
    creatorId: number;

    @Prop()
    buyerId: number;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
PurchaseSchema.index({ purchaseId: 1 }, { unique : true });