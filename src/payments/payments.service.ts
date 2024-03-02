import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
    ) {}

    getPayments(): Promise<Payment[]> {
        return this.paymentModel.find();
    }

    getPaymentId(id: string): Promise<Payment> {
        return this.paymentModel.findOne({ _id: id });
    }

    async createPayment(params: PaymentCreateDto): Promise<Payment | string> {
        const payload = {
            title: params.title,
            cardNumber: params.cardNumber,
            fio: params.fio,
            bankType: params.bankType,
            processMethod: params.processMethod,
            currency: params.currency,
            deviceId: params.deviceId,
            apiKey: params.apiKey,
            slotSim: params.slotSim,
            isQiwi: params.isQiwi,
            isSbp: params.isSbp,
            phone: params.phone,
            recipient: params.recipient,
        };

        const newPayment = new this.paymentModel(payload);
        newPayment.save();

        return newPayment;
    }
}