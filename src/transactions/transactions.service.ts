import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionConfirmDto } from './dto/transaction-confirm.dto';
import { Transaction } from './schemas/transaction.schema';
import { Payment } from '../payments/schemas/payment.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    getTransactions(): Promise<Transaction[]> {
        return this.transactionModel.find().exec();
    }

    async createTransaction(params: TransactionCreateDto): Promise<Payment | string> {
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

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        const transaction = await this.transactionModel.findOne({ amount: params.amount });

        if (transaction) {
            return 'Операция успешно прошла!';
        }

        return `В БД нет операции с данный суммой`;
    }

    confirmTransaction(params: TransactionConfirmDto): string {
        return `Оплата №${params.id} прошла успешно!`;
    }
}