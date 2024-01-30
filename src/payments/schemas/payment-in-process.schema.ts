import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentInProcessDocument = HydratedDocument<PaymentInProcess>;

@Schema({ timestamps: true })
export class PaymentInProcess {
    @Prop()
    unicId: string;

    @Prop()
    methodId: string;
}

export const PaymentInProcessSchema = SchemaFactory.createForClass(PaymentInProcess);
PaymentInProcessSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });