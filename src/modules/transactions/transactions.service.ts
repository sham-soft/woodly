import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { MakeTransactionService } from './services/make-transaction.service';
import { ExportTransactionService } from './services/export-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { Transaction } from './schemas/transaction.schema';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionExportQueryDto } from './dto/transaction-export.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import { TRANSACTION_STATUSES } from '../../helpers/constants';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly makeTransactionService: MakeTransactionService,
        private readonly createTransactionService: CreateTransactionService,
        private readonly exportTransactionService: ExportTransactionService,
    ) {}

    async getTransactions(query: TransactionQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const filters = getFilters(query, {
            transactionId: FilterRules.REGEX_INTEGER,
            status: FilterRules.EQUAL,
            title: FilterRules.REGEX_STRING_OR,
            cardNumber: FilterRules.REGEX_STRING_OR,
            amount: FilterRules.REGEX_INTEGER,
            orderNumber: FilterRules.REGEX_INTEGER,
            clientNumber: FilterRules.REGEX_STRING,
            cashbox: FilterRules.EQUAL,
            dateEnd: FilterRules.CREATE_LT,
        });

        const countTransactions = await this.transactionModel.countDocuments(filters);
        const data = await this.transactionModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: countTransactions,
            page: pagination.page,
            limit: pagination.limit,
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

    async getTransactionsExport(query: TransactionExportQueryDto): Promise<StreamableFile> {
        return this.exportTransactionService.getTransactionsExport(query);
    }
}