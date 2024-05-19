import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
    @Prop()
    title: string;

    @Prop()
    cardNumber: string;

    @Prop()
    fio: string;

    @Prop()
    bankType: number;

    @Prop()
    processMethod: number;

    @Prop()
    currency: string;
    
    @Prop()
    deviceId: string;
    
    @Prop()
    apiKey: string;

    @Prop()
    slotSim: number;

    @Prop()
    isSbp: boolean;

    @Prop()
    phone: string;

    @Prop()
    recipient: string;

    @Prop()
    turnoverPaymentsPerDay: number;

    @Prop()
    turnoverTransactionsPerDay: number;

    @Prop()
    paymentsLimitPerDay: number;

    @Prop()
    transactionsLimitPerDay: number;

    @Prop()
    paymentMin: number;

    @Prop()
    paymentMax: number;

    @Prop()
    status: number;

    @Prop()
    cardId: number;

    @Prop()
    cardLastNumber: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
CardSchema.index({ cardId: 1 }, { unique : true });