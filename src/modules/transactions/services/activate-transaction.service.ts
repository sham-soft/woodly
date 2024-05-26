import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionActivateDto } from '../dto/transaction-activate.dto';
import { UsersService } from '../../users/users.service';
import { Card } from '../../cards/schemas/card.schema';
import { getСurrentDateToString, convertDateToString } from '../../../helpers/date';
import { CARD_STATUSES, TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class ActivateTransactionService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly usersService: UsersService,
    ) {}

    async activateTransaction(params: TransactionActivateDto): Promise<Transaction | string> {
        const card = await this.getCard(params);

        await this.checkWorkTransactions(card);

        if (card) {
            const payload = {
                status: TRANSACTION_STATUSES.Active,
                dateActivate: getСurrentDateToString(),
                dateClose: this.getDateClose(),
                card: {
                    title: card.title,
                    cardId: card.cardId,
                    cardNumber: card.cardNumber,
                    phone: card.phone,
                    recipient: card.recipient,
                    fio: card.fio,
                    bankType: card.bankType,
                    cardLastNumber: card.cardLastNumber,
                },
            };

            return this.transactionModel.findOneAndUpdate(
                { transactionId: params.transactionId },
                { $set: payload }, 
                { new: true }
            );
        }

        throw new BadRequestException('Нет свободных реквизитов.');
    }

    private async checkWorkTransactions(card: Card): Promise<void> {
        const user = await this.usersService.getUser(card.userId);

        if (!user.isWorkTransactions) {
            throw new BadRequestException('На данный момент сделки отключены');
        }
    }

    private getDateClose(): string {
        const nextDate = new Date();
        nextDate.setTime(nextDate.getTime() + (4 * 60 * 1000));

        return convertDateToString(nextDate);
    }

    private async getCard(params: TransactionActivateDto): Promise<Card> {
        const currentTransaction = await this.transactionModel.findOne({ transactionId: params.transactionId });

        if (!currentTransaction) {
            throw new BadRequestException('На активной транзакции с id: ' + params.transactionId);
        }

        const blockingTransactions = await this.transactionModel.find({
            status: TRANSACTION_STATUSES.Active,
            amount: currentTransaction.amount,
        });
        const idsCard = blockingTransactions.map((item) => item.card.cardId);

        const filters: any = params.isSbp ? { isSbp: true } : { bankType: params.bankType };
        filters.cardId = { $nin: idsCard };
        filters.status = CARD_STATUSES.Active;
        filters.$and = [
            { $expr: { $gt: ['$paymentsLimitPerDay', '$turnoverPaymentsPerDay'] } },
            { $expr: { $gt: ['$transactionsLimitPerDay', '$turnoverTransactionsPerDay'] } },
        ];
        filters.paymentMin = { $lte: currentTransaction.amount };
        filters.paymentMax = { $gte: currentTransaction.amount };

        const cardsRandom = await this.cardModel.aggregate([{ $match: filters }, { $sample: { size: 1 } }]);
        return cardsRandom[0];
    }
}