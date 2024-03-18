import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../../cards/schemas/card.schema';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';
import { isToday, getСurrentDateToString } from '../../../helpers/date';
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
        });

        if (transaction) {
            const payloadTransaction = {
                status: TRANSACTION_STATUSES.Successful,
                paymentTime: getСurrentDateToString(),
            };

            await this.transactionModel.findOneAndUpdate({ transactionId: transaction.transactionId }, { $set: payloadTransaction });
            await this.updateCardTurnover(transaction);

            return 'Операция успешно прошла!';
        }

        const sortTransactions = await this.transactionModel.find().sort({ transactionId: -1 }).limit(1);
        const transactionId = sortTransactions[0]?.transactionId || 0;

        const payload = {
            transactionId: transactionId + 1,
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            paymentTime: getСurrentDateToString(),
            status: TRANSACTION_STATUSES.Verification,
        };

        const newTransactionCompleted = new this.transactionModel(payload);
        newTransactionCompleted.save();

        throw new BadRequestException('Операция с такой суммой не найдена');
    }

    private async updateCardTurnover(transaction: Transaction) {
        const card = await this.cardModel.findOne({ cardId: transaction.cardId });

        let turnoverPaymentsPerDay = transaction.amount;
        let turnoverTransactionsPerDay = 1;

        if (isToday(new Date(card.lastModifiedTurnover))) {
            turnoverPaymentsPerDay = turnoverPaymentsPerDay + card.turnoverPaymentsPerDay;
            turnoverTransactionsPerDay = turnoverTransactionsPerDay + card.turnoverTransactionsPerDay;
        }

        const payload = {
            turnoverPaymentsPerDay,
            turnoverTransactionsPerDay,
            lastModifiedTurnover: getСurrentDateToString(),
        };
        
        await this.cardModel.findOneAndUpdate({ cardId: card.cardId }, { $set: payload });
    }
}