import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AutopaymentDocument = HydratedDocument<Autopayment>;

@Schema()
export class Autopayment {
    @Prop()
    autopaymentId: number;

    @Prop()
    transactionId?: number;

    @Prop()
    cardLastNumber: string;

    @Prop()
    amount: number;

    @Prop()
    paymentTime: string;

    @Prop()
    message: string;
}

export const AutopaymentSchema = SchemaFactory.createForClass(Autopayment);
AutopaymentSchema.index({ autopaymentId: 1 }, { unique : true });