import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
    // @Prop()
    // _id?: string;

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
    currency: number;
    
    @Prop()
    deviceId: string;
    
    @Prop()
    apiKey: string;

    @Prop()
    slotSim: number;

    @Prop()
    isQiwi: boolean;

    @Prop()
    isSbp: boolean;

    @Prop()
    phone: string;

    @Prop()
    recipient: string;

    @Prop()
    turnover: number;

    @Prop()
    transactionsLimitPerDay: number;

    @Prop()
    paymentMin: number;

    @Prop()
    paymentMax: number;

    @Prop()
    status: boolean;

    @Prop()
    cardId: number;

    // @Prop()
    // amount?: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
CardSchema.index({ cardId: 1 }, { unique : true });