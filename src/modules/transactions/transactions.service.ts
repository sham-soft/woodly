import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '@/modules/cards/schemas/card.schema';
import { CARD_STATUSES, TRANSACTION_STATUSES } from '@/helpers/constants';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async getTransactions(query: TransactionQueryDto) {
        const limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        type filtersType = {
            status?: number,
            $expr?: any,
            $or?: any,
        }
        const filters: filtersType = {};

        if (query.status) {
            filters.status = query.status;
        }

        if (query.transactionId) {
            filters.$expr = {
                $regexMatch: {
                   input: { $toString: '$transactionId' }, 
                   regex: query.transactionId,
                },
            };
        }

        if (query.cardNumberAndTitle) {
            filters.$or = [
                { title: { $regex: query.cardNumberAndTitle } },
                { cardNumber: { $regex: query.cardNumberAndTitle } },
            ];
        }

        if (query.amount) {
            filters.$expr = {
                $regexMatch: {
                   input: { $toString: '$amount' }, 
                   regex: query.amount,
                },
            };
        }

        const countTransactions = await this.transactionModel.countDocuments(filters);
        const data = await this.transactionModel.find(filters).skip(skip).limit(limit);

        return {
            total: countTransactions,
            page: query.page || 1,
            count: data.length,
            transactions: data,
        };
    }

    async createTransaction(params: TransactionCreateDto): Promise<Transaction | string> {
        // Get max transactionId
        const sortTransactions = await this.transactionModel.find().sort({ transactionId: -1 }).limit(1);
        const transactionId = sortTransactions[0]?.transactionId || 0;
        
        // Get dates
        const currentDate = new Date();
        const nextDate = new Date();
        nextDate.setTime(nextDate.getTime() + (4 * 60 * 1000));

        const dateCreate = currentDate.toLocaleString( 'sv', { timeZoneName: 'short' } );
        const dateClose = nextDate.toLocaleString( 'sv', { timeZoneName: 'short' } );

        // Get card
        const transactions = await this.transactionModel.find({ amount: params.amount });
        const idsCard = transactions.map((item) => item.cardId);

        const filters: any = params.isSbp ? { isSbp: true } : { bankType: params.bankType };
        filters.cardId = { $nin: idsCard };
        filters.status = CARD_STATUSES.Active;
        const cards = await this.cardModel.aggregate([
            { $match: filters },
            { $sample: { size: 1 } },
        ]);
        const cardRandom = cards[0];

        if (cardRandom) {
            const payload = {
                transactionId: transactionId + 1,
                amount: params.amount,
                status: TRANSACTION_STATUSES.Active,
                dateCreate: dateCreate,
                dateClose: dateClose,
                title: cardRandom.title,
                cardId: cardRandom.cardId,
                cardNumber: cardRandom.cardNumber,
                phone: cardRandom.phone,
                recipient: cardRandom.recipient,
                fio: cardRandom.fio,
                bankType: cardRandom.bankType,
                cardLastNumber: cardRandom.cardLastNumber,
            };
    
            const newTransaction = new this.transactionModel(payload);
            newTransaction.save();
    
            return newTransaction;
        }

        throw new BadRequestException('Нет свободных реквизитов.');
    }

    async editTransaction(params: TransactionEditDto): Promise<Transaction> {
        type payloadType = {
            status?: number,
            amount?: number,
        }
        const payload: payloadType = {};

        if (params.status) {
            payload.status = params.status;
        }
        if (params.amount) {
            const transaction = await this.transactionModel.findOne({ cardId: params.cardId, amount: params.amount });

            if (transaction) {
                throw new BadRequestException('Операция с такой суммой и картой уже есть в работе');
            }

            payload.amount = params.amount;
        }

        return this.transactionModel.findOneAndUpdate(
            { transactionId: params.transactionId },
            { $set: payload }, 
            { new: true }
        );
    }

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        const transaction = await this.transactionModel.findOne({
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            status: TRANSACTION_STATUSES.Active,
        });

        const currentDate = new Date().toLocaleString( 'sv', { timeZoneName: 'short' } );

        if (transaction) {
            const payload = {
                status: TRANSACTION_STATUSES.Successful,
                paymentTime: currentDate,
            };

            await this.transactionModel.findOneAndUpdate({ transactionId: transaction.transactionId }, { $set: payload });
            return 'Операция успешно прошла!';
        }

        const sortTransactions = await this.transactionModel.find().sort({ transactionId: -1 }).limit(1);
        const transactionId = sortTransactions[0]?.transactionId || 0;

        const payload = {
            transactionId: transactionId + 1,
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            paymentTime: currentDate,
            status: TRANSACTION_STATUSES.Verification,
        };

        const newTransactionCompleted = new this.transactionModel(payload);
        newTransactionCompleted.save();

        throw new BadRequestException('Операция с такой суммой не найдена');
    }

    async confirmTransaction(id: string): Promise<string> {
        const transaction = await this.transactionModel.findOne({ transactionId: id });

        if (transaction?.status === TRANSACTION_STATUSES.Successful) {
            return 'Платеж успешно зачислен';
        }

        throw new BadRequestException('Время истекло или не удалось обработать ваш платеж');
    }
}