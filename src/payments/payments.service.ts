import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDto } from './dto/payment.dto';
import { Payment } from './schemas/payment.schema';
import { PaymentInProcess } from './schemas/payment-in-process.schema';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
        @InjectModel('paymentsInProcess') private paymentsInProcessModel: Model<PaymentInProcess>,
    ) {}

    getPayments(): Promise<Payment[]> {
        return this.paymentModel.find().exec();
    }

    getPaymentsInProcess(): Promise<PaymentInProcess[]> {
        return this.paymentsInProcessModel.find().exec();
    }

    getPaymentId(id: string): Promise<Payment> {
        return this.paymentModel.findOne({ methodId: id });
    }

    async getPaymentAvailable(params: PaymentDto): Promise<Payment | string> {
        const paymentsInProcess = await this.paymentsInProcessModel.find({ methodId: params.methodId }).exec();

        const idsInProcess = paymentsInProcess.map((payment) => payment.unicId);

        const payment = await this.paymentModel.findOne({ _id: { $nin: idsInProcess }, methodId: params.methodId });

        if (payment) {
            const response = {
                unicId: payment._id,
                methodId: payment.methodId,
                phone: payment.phone,
                recipient: payment.recipient,
                name: payment.name,
                amount: params.amount,
            };

            const createdPaymentInProcess = new this.paymentsInProcessModel(response);
            createdPaymentInProcess.save();
    
            return response;
        }

        return 'Некорректные входящие данные!';
    }
}