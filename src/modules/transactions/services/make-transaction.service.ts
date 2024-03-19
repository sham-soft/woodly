import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../../cards/schemas/card.schema';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';
import { getСurrentDateToString } from '../../../helpers/date';
import { TransactionMakeDto } from '../dto/transaction-make.dto';
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class MakeTransactionService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        const transaction = await this.transactionModel.findOne({
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            status: TRANSACTION_STATUSES.Active,
            dateClose: { $gt: getСurrentDateToString() },
        });

        if (transaction) {
            const payloadTransaction = {
                status: TRANSACTION_STATUSES.Successful,
                paymentTime: getСurrentDateToString(),
                message: params.message,
            };

            await this.transactionModel.findOneAndUpdate({ transactionId: transaction.transactionId }, { $set: payloadTransaction });
            await this.updateCardTurnover(transaction);

            return 'Операция успешно прошла!';
        }

        const newTransactionId = await this.createNewId();

        const payload = {
            transactionId: newTransactionId,
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            paymentTime: getСurrentDateToString(),
            status: TRANSACTION_STATUSES.Verification,
            message: params.message,
        };

        const newTransactionCompleted = new this.transactionModel(payload);
        newTransactionCompleted.save();

        throw new BadRequestException('Операция с такой суммой не найдена');
    }

    private async updateCardTurnover(transaction: Transaction) {
        const card = await this.cardModel.findOne({ cardId: transaction.cardId });

        const payload = {
            turnoverPaymentsPerDay: card.turnoverPaymentsPerDay + transaction.amount,
            turnoverTransactionsPerDay: card.turnoverTransactionsPerDay + 1,
        };
        
        await this.cardModel.findOneAndUpdate({ cardId: card.cardId }, { $set: payload });
    }

    private async createNewId(): Promise<number> {
        const sortTransactions = await this.transactionModel.find().sort({ transactionId: -1 }).limit(1);
        const lastTransactionId = sortTransactions[0]?.transactionId || 0;

        return lastTransactionId + 1;
    }
}