import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { MakeTransactionService } from './services/make-transaction.service';
import { ExportTransactionService } from './services/export-transaction.service';
import { CreateTransactionService } from './services/create-transaction.service';
import { ActivateTransactionService } from './services/activate-transaction.service';
import { Transaction } from './schemas/transaction.schema';
import { TransactionQueryDto } from './dto/transaction.dto';
import { TransactionMakeDto } from './dto/transaction-make.dto';
import { TransactionExportQueryDto } from './dto/transaction-export.dto';
import { TransactionEditDto } from './dto/transaction-edit.dto';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionActivateDto } from './dto/transaction-activate.dto';
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import { getСurrentDateToString } from '../../helpers/date';
import { TRANSACTION_STATUSES } from '../../helpers/constants';
import { ROLES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly makeTransactionService: MakeTransactionService,
        private readonly createTransactionService: CreateTransactionService,
        private readonly exportTransactionService: ExportTransactionService,
        private readonly activateTransactionService: ActivateTransactionService,
    ) {}

    async getTransactions(query: TransactionQueryDto, user: CustomRequest['user']): Promise<PaginatedList<Transaction>> {
        const pagination = getPagination(query.page);

        const extraFilters = getFilters({
            transactionId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
            status: { rule: FilterRules.EQUAL, value: query.status },
            amount: { rule: FilterRules.REGEX_INTEGER, value: query.amount },
            orderNumber: { rule: FilterRules.REGEX_INTEGER, value: query.orderNumber },
            clientNumber: { rule: FilterRules.REGEX_STRING, value: query.clientNumber },
            'cashbox.cashboxId': { rule: FilterRules.EQUAL, value: query.cashboxId },
            dateCreate: { rule: FilterRules.LT, value: query.dateEnd },
            'card.title': { rule: FilterRules.REGEX_STRING_OR, value: query.title },
            'card.cardNumber': { rule: FilterRules.REGEX_STRING_OR, value: query.cardNumber },
        });

        const filters = {
            status: { $nin: user.role === ROLES.Trader ? [TRANSACTION_STATUSES.Created] : [] },
            ...extraFilters,
        };

        const total = await this.transactionModel.countDocuments(filters);
        const data = await this.transactionModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async createTransaction(params: TransactionCreateDto): Promise<Transaction> {
        return this.createTransactionService.createTransaction(params);
    }

    async activateTransaction(params: TransactionActivateDto): Promise<Transaction | string> {
        return this.activateTransactionService.activateTransaction(params);
    }

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        return this.makeTransactionService.makeTransaction(params);
    }

    async checkStatusTransaction(id: string): Promise<string> {
        const transaction = await this.transactionModel.findOne({ transactionId: id });

        if (transaction?.status === TRANSACTION_STATUSES.Successful) {
            return 'Платеж успешно зачислен';
        }

        throw new BadRequestException('Время истекло или не удалось обработать ваш платеж');
    }

    async editTransaction(params: TransactionEditDto): Promise<Transaction> {
        const transaction = await this.transactionModel.findOne({ cardId: params.cardId, amount: params.amount });

        if (transaction) {
            throw new BadRequestException('Операция с такой суммой и картой уже есть в работе');
        }

        return this.transactionModel.findOneAndUpdate(
            { transactionId: params.transactionId },
            { $set: { amount: params.amount } }, 
            { new: true }
        );
    }

    async confirmTransaction(id: number): Promise<Transaction> {
        return this.transactionModel.findOneAndUpdate(
            { transactionId: id },
            { $set: { status: TRANSACTION_STATUSES.Successful } }, 
            { new: true }
        );
    }

    async cancelTransaction(id: number): Promise<Transaction> {
        return this.transactionModel.findOneAndUpdate(
            { transactionId: id },
            { $set: { status: TRANSACTION_STATUSES.Cancelled, dateCancel: getСurrentDateToString() } }, 
            { new: true }
        );
    }

    async getTransactionsExport(query: TransactionExportQueryDto, user: CustomRequest['user']): Promise<StreamableFile> {
        return this.exportTransactionService.getTransactionsExport(query, user);
    }

    async getTransactionsCount(filters: unknown): Promise<number> {
        return this.transactionModel.countDocuments(filters);
    }

    async getTransactionsCollection(filters: unknown, skip?: number, limit?: number): Promise<Transaction[]> {
        return this.transactionModel.find(filters).skip(skip).limit(limit);
    }

    async updateTransactionsCollection(filters: unknown, values: unknown): Promise<void> {
        this.transactionModel.updateMany(filters, { $set: values });
    }
}