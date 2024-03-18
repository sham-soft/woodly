import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config } from '../../configs/schemas/config.schema';
import { Card } from '../../cards/schemas/card.schema';
import { CARD_STATUSES, TRANSACTION_STATUSES } from '../../../helpers/constants';
import { getСurrentDateToString, convertDateToString } from '../../../helpers/date';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class CreateTransactionService {
    constructor(
        @InjectModel('configs') private configModel: Model<Config>,
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async createTransaction(params: TransactionCreateDto): Promise<Transaction | string> {
        await this.checkWorkTransactions();

        const card = await this.getCard(params);

        if (card) {
            const newTransactionId = await this.createNewId();

            const payload = {
                transactionId: newTransactionId,
                amount: params.amount,
                status: TRANSACTION_STATUSES.Active,
                dateCreate: getСurrentDateToString(),
                dateClose: this.getDateClose(),
                title: card.title,
                cardId: card.cardId,
                cardNumber: card.cardNumber,
                phone: card.phone,
                recipient: card.recipient,
                fio: card.fio,
                bankType: card.bankType,
                cardLastNumber: card.cardLastNumber,
            };
    
            const newTransaction = new this.transactionModel(payload);
            newTransaction.save();
    
            return newTransaction;
        }

        throw new BadRequestException('Нет свободных реквизитов.');
    }

    private async checkWorkTransactions(): Promise<void> {
        const config = await this.configModel.findOne({ name: 'IS_WORK_TRANSACTIONS' });

        if (config?.value === 'false') {
            throw new BadRequestException('На данный момент сделки отключены');
        }
    }

    private async createNewId(): Promise<number> {
        const sortTransactions = await this.transactionModel.find().sort({ transactionId: -1 }).limit(1);
        const lastTransactionId = sortTransactions[0]?.transactionId || 0;

        return lastTransactionId + 1;
    }

    private getDateClose(): string {
        const nextDate = new Date();
        nextDate.setTime(nextDate.getTime() + (4 * 60 * 1000));

        return convertDateToString(nextDate);
    }

    private async getCard(params: TransactionCreateDto): Promise<Card> {
        const transactions = await this.transactionModel.find({ status: TRANSACTION_STATUSES.Active, amount: params.amount });
        const idsCard = transactions.map((item) => item.cardId);

        const filters: any = params.isSbp ? { isSbp: true } : { bankType: params.bankType };
        filters.cardId = { $nin: idsCard };
        filters.status = CARD_STATUSES.Active;

        const cardsRandom = await this.cardModel.aggregate([{ $match: filters }, { $sample: { size: 1 } }]);
        return cardsRandom[0];
    }
}