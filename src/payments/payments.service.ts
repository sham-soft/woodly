import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
    ) {}

    getPayments(): Promise<Payment[]> {
        return this.paymentModel.find().exec();
    }

    getPaymentId(id: string): Promise<Payment> {
        return this.paymentModel.findOne({ _id: id });
    }
}