import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
// import { TransactionMakeDto } from './dto/transaction-make.dto';
import { Transaction } from './schemas/transaction.schema';
import { Card } from '../cards/schemas/card.schema';

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

        if (query.cardId) {
            filters.$expr = {
                $regexMatch: {
                   input: { $toString: '$cardId' }, 
                   regex: query.cardId,
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
        const countTransactions = await this.transactionModel.countDocuments();
        
        const currentDate = new Date();
        const nextDate = new Date();
        nextDate.setTime(nextDate.getTime() + (4 * 60 * 1000));

        const dateCreate = currentDate.toLocaleString( 'sv', { timeZoneName: 'short' } );
        const dateClose = nextDate.toLocaleString( 'sv', { timeZoneName: 'short' } );

        const transactions = await this.transactionModel.find({ amount: params.amount });
        const idsCard = transactions.map((item) => item.cardId);

        const filters: any = params.isSbp ? { isSbp: true } : { bankType: params.bankType };
        filters.cardId = { $nin: idsCard };
        const cards = await this.cardModel.aggregate([
            { $match: filters },
            { $sample: { size: 1 } },
        ]);
        const cardRandom = cards[0];

        if (cardRandom) {
            const payload = {
                transactionId: countTransactions + 1,
                amount: params.amount,
                status: 1,
                dateCreate: dateCreate,
                dateClose: dateClose,
                title: cardRandom.title,
                cardId: cardRandom.cardId,
                cardNumber: cardRandom.cardNumber,
                phone: cardRandom.phone,
                recipient: cardRandom.recipient,
                fio: cardRandom.fio,
                bankType: cardRandom.bankType,
            };
    
            const newTransaction = new this.transactionModel(payload);
            newTransaction.save();
    
            return newTransaction;
        }

        throw new BadRequestException('Нет свободных реквизитов.');
    }

    async confirmTransaction(id: string): Promise<string> {
        const transaction = await this.transactionModel.findOne({ transactionId: id });

        if (transaction?.status === 4) {
            return 'Платеж успешно зачислен';
        }

        throw new BadRequestException('Время истекло или не удалось обработать ваш платеж');
    }

    // async makeTransaction(params: TransactionMakeDto): Promise<string> {
    //     const transaction = await this.transactionModel.findOneAndDelete({ amount: params.amount });

    //     const currentDate = new Date().toLocaleString( 'sv', { timeZoneName: 'short' } );

    //     if (transaction) {
    //         const payload = {
    //             transactionId: transaction._id,
    //             paymentId: transaction.paymentId,
    //             amount: transaction.amount,
    //             paymentTime: currentDate,
    //         };

    //         const newTransactionCompleted = new this.transactionCompletedModel(payload);
    //         newTransactionCompleted.save();

    //         return 'Операция успешно прошла!';
    //     }

    //     const payload = {
    //         amount: params.amount,
    //         paymentTime: currentDate,
    //     };

    //     const newTransactionCompleted = new this.transactionCompletedModel(payload);
    //     newTransactionCompleted.save();


    //     throw new BadRequestException('Нет операции с такой суммой');
    // }
}