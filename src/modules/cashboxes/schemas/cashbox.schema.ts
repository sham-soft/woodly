import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CashboxDocument = HydratedDocument<Cashbox>;

@Schema()
export class Cashbox {
    @Prop()
    cashboxId: number;

    @Prop()
    title: string;

    @Prop()
    url: string;

    @Prop()
    successUrl: string;

    @Prop()
    errorUrl: string;

    @Prop()
    notificationUrlPayments: string;

    @Prop()
    notificationUrlPayOff: string;

    @Prop()
    commissionPayer: number;

    @Prop()
    apiKey: string;

    @Prop()
    creatorId: number;

    @Prop()
    status: number;

    @Prop({ type: Object })
    balance: {
        rub: number;
    };

    @Prop({ type: Array })
    tariffs: {
        tariffId: string;
        title: string;
        type: string;
        limitMin: number;
        limitMax: number;
        commissionPercent: number;
        commissionAmount: number;
    }[];
}

export const CashboxSchema = SchemaFactory.createForClass(Cashbox);
CashboxSchema.index({ cashboxId: 1 }, { unique : true });