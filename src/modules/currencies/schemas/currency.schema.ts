import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema()
export class Currency {
    @Prop()
    currencyId: string;

    @Prop()
    name: string;

    @Prop()
    rate: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
CurrencySchema.index({ currencyId: 1}, { unique : true });