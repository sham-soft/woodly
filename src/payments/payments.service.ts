import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { PaymentMakeDto } from './dto/payment-make.dto';
import { PaymentConfirmDto } from './dto/payment-confirm.dto';
import { Payment } from './schemas/payment.schema';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    getPayments(): Promise<Payment[]> {
        return this.paymentModel.find().exec();
    }

    getTransactions(): Promise<Transaction[]> {
        return this.transactionModel.find().exec();
    }

    getPaymentId(id: string): Promise<Payment> {
        return this.paymentModel.findOne({ _id: id });
    }

    async createOperation(params: PaymentCreateDto): Promise<Payment | string> {
        const transactions = await this.transactionModel.find({
            methodId: params.methodId,
            amount: params.amount,
        }).exec();

        const idsInProcess = transactions.map((payment) => payment.paymentId);

        const payment = await this.paymentModel.findOne({ _id: { $nin: idsInProcess }, methodId: params.methodId });

        if (payment) {
            const response = {
                paymentId: payment._id,
                methodId: payment.methodId,
                phone: payment.phone,
                recipient: payment.recipient,
                name: payment.name,
                amount: params.amount,
            };

            const createdPaymentInProcess = new this.transactionModel(response);
            createdPaymentInProcess.save();
    
            return response;
        }

        return 'Данные введены некорректно или нет свободных реквизитов!';
    }

    async makePayment(params: PaymentMakeDto): Promise<string> {
        const transaction = await this.transactionModel.findOne({ amount: params.amount });

        if (transaction) {
            return 'Операция успешно прошла!';
        }

        return `В БД нет операции с данный суммой`;
    }

    confirmPayment(params: PaymentConfirmDto): string {
        return `Оплата №${params.id} прошла успешно!`;
    }
}