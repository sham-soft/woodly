import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionConfirmDto } from './dto/transaction-confirm.dto';
import { Transaction } from './schemas/transaction.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { TransactionCompleted } from './schemas/transaction-completed.schema';
import { TransactionHistory } from './schemas/transaction-history.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('payments') private paymentModel: Model<Payment>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        @InjectModel('transactionsCompleted') private transactionCompletedModel: Model<TransactionCompleted>,
        @InjectModel('transactionsHistory') private transactionHistorydModel: Model<TransactionHistory>,
    ) {}

    getTransactions(): Promise<Transaction[]> {
        return this.transactionModel.find();
    }

    async createTransaction(params: TransactionCreateDto): Promise<Transaction | string> {
        const isExistAmount = await this.transactionModel.findOne({ amount: params.amount });

        if (isExistAmount) {
            throw new BadRequestException('Операция с такой суммой уже в работе. Измените сумму!');
        }

        const transactions = await this.transactionModel.find({ methodId: params.methodId });
        const idsPayment = transactions.map((payment) => payment.paymentId);

        let payment = await this.paymentModel.findOne({ _id: { $nin: idsPayment }, methodId: params.methodId });

        if (!payment) {
            const paymentsRandom = await this.paymentModel.aggregate([
                { $match: { methodId: params.methodId } },
                { $sample: { size: 1 } },
            ]);

            payment = paymentsRandom[0];
        }

        if (payment) {
            const payload = {
                paymentId: payment._id,
                methodId: payment.methodId,
                phone: payment.phone,
                recipient: payment.recipient,
                name: payment.name,
                amount: params.amount,
            };

            const newTransaction = new this.transactionModel(payload);
            newTransaction.save();
    
            return newTransaction;
        }

        throw new BadRequestException('Неккоректный запрос');
    }

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        const transaction = await this.transactionModel.findOneAndDelete({ amount: params.amount });

        const currentDate = new Date().toLocaleString( 'sv', { timeZoneName: 'short' } );

        if (transaction) {
            const payload = {
                transactionId: transaction._id,
                paymentId: transaction.paymentId,
                amount: transaction.amount,
                paymentTime: currentDate,
            };

            const newTransactionCompleted = new this.transactionCompletedModel(payload);
            newTransactionCompleted.save();

            return 'Операция успешно прошла!';
        }

        const payload = {
            amount: params.amount,
            paymentTime: currentDate,
        };

        const newTransactionCompleted = new this.transactionCompletedModel(payload);
        newTransactionCompleted.save();


        throw new BadRequestException('Нет операции с такой суммой');
    }

    async confirmTransaction(params: TransactionConfirmDto): Promise<string> {
        const transactionCompleted = await this.transactionCompletedModel.findOneAndDelete({ transactionId: params.transactionId });

        if (transactionCompleted) {
            const payload = {
                transactionId: transactionCompleted.transactionId,
                paymentId: transactionCompleted.paymentId,
                amount: transactionCompleted.amount,
                paymentTime: transactionCompleted.paymentTime,
            };

            const newTransactionHistory = new this.transactionHistorydModel(payload);
            newTransactionHistory.save();

            return 'Платеж успешно зачислен';
        }

        throw new BadRequestException('Время истекло или не удалось обработать ваш платеж');
    }
}