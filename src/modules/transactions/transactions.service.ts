import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TRANSACTION_STATUSES } from '../../helpers/constants';
import { MakeTransactionService } from './services/make-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly makeTransactionService: MakeTransactionService,
        private readonly createTransactionService: CreateTransactionService,
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
        return this.createTransactionService.createTransaction(params);
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
       return this.makeTransactionService.makeTransaction(params);
    }

    async confirmTransaction(id: string): Promise<string> {
        const transaction = await this.transactionModel.findOne({ transactionId: id });

        if (transaction?.status === TRANSACTION_STATUSES.Successful) {
            return 'Платеж успешно зачислен';
        }

        throw new BadRequestException('Время истекло или не удалось обработать ваш платеж');
    }
}