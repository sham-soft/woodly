import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop()
    _id?: string;

    @Prop()
    methodId: string;

    @Prop()
    phone: string;

    @Prop()
    recipient: string;

    @Prop()
    name: string;

    @Prop()
    amount?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);