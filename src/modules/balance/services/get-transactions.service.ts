import { Injectable } from '@nestjs/common';
import { TransfersService } from '../../transfers/transfers.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { PurchasesService } from '../../purchases/purchases.service';
import { getPagination } from '../../../helpers/pagination';
import { getFilters, FilterRules } from '../../../helpers/filters';
import { TRANSACTION_STATUSES, PURCHASE_STATUSES, BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceTransaction } from '../types/balance.type';
import type { BalanceTransactionsQueryDto } from '../dto/balance-transactions.dto';
import type { PaginatedList } from '../../../types/paginated-list.type';

@Injectable()
export class GetTransactionsService {
    constructor(
        private readonly purchasesService: PurchasesService,
        private readonly transfersService: TransfersService,
        private readonly transactionsService: TransactionsService,
    ) {}

    async getBalanceTransactions(query: BalanceTransactionsQueryDto, userId: number): Promise<PaginatedList<BalanceTransaction>> {
        const pagination = getPagination(query.page);
        let total = 0;
        let transactions = [];

        const filtersSuccesPurchases = getFilters({
            purchaseId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
            hashId: { rule: FilterRules.REGEX_STRING, value: query.paymentId },
            status: { rule: FilterRules.EQUAL, value: PURCHASE_STATUSES.Successful },
            buyerId: { rule: FilterRules.EQUAL, value: userId },
            amount: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.amountStart, lte: query.amountEnd },
            },
            dateClose: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
        });

        const filtersSuccesTransactions = getFilters({
            transactionId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
            hashId: { rule: FilterRules.REGEX_STRING, value: query.paymentId },
            status: { rule: FilterRules.EQUAL, value: TRANSACTION_STATUSES.Successful },
            'card.creatorId': { rule: FilterRules.EQUAL, value: userId },
            amount: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.amountStart, lte: query.amountEnd },
            },
            dateClose: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
        });

        const filtersActiveTransactions = getFilters({
            transactionId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
            hashId: { rule: FilterRules.REGEX_STRING, value: query.paymentId },
            status: { rule: FilterRules.EQUAL, value: TRANSACTION_STATUSES.Active },
            'card.creatorId': { rule: FilterRules.EQUAL, value: userId },
            amount: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.amountStart, lte: query.amountEnd },
            },
            dateClose: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
        });

        const filtersTransfers = getFilters({
            transferId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
            hashId: { rule: FilterRules.REGEX_STRING, value: query.paymentId },
            creatorId: { rule: FilterRules.EQUAL, value: userId },
            amount: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.amountStart, lte: query.amountEnd },
            },
            dateCreate: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
        });

        switch (Number(query.status)) {
            case BALANCE_STATUSES.Internal:
                total = 0;
                transactions = [];
                break;

            case BALANCE_STATUSES.Deposit:
            {
                // Проверяем количество документов во двух источниках
                const totalTransfers = await this.transfersService.getTransfersCount(filtersTransfers);
                const totalSuccesPurchases = await this.purchasesService.getPurchasesCount(filtersSuccesPurchases);
                
                // Вычисляем сколько всего источников, у которых на данной странице есть документы
                const totalsCount = [totalTransfers, totalSuccesPurchases].filter(item => (item - pagination.skip) !== 0).length;

                // Вычисляем отдельный лимит для двух источников
                const limit = pagination.limit / totalsCount;
                // Вычисляем отдельный шаг для двух источников
                const skip = getPagination(query.page, limit).skip;

                let transactionsTransfers = [];
                let transactionsSuccesPurchases = [];

                if (totalTransfers) {
                    transactionsTransfers = await this.getTransfers(filtersTransfers, skip, limit);
                }

                if (totalSuccesPurchases) {
                    transactionsSuccesPurchases = await this.getPurchases(filtersSuccesPurchases, skip, limit);
                }

                transactions = [
                    ...transactionsTransfers,
                    ...transactionsSuccesPurchases,
                ];

                break;
            }
            case BALANCE_STATUSES.Deduction:
            case BALANCE_STATUSES.Freeze:
            {
                const status = Number(query.status) === BALANCE_STATUSES.Deduction ?
                    TRANSACTION_STATUSES.Successful : TRANSACTION_STATUSES.Active;
                const filters = getFilters({
                    transactionId: { rule: FilterRules.REGEX_INTEGER, value: query.transactionId },
                    status: { rule: FilterRules.EQUAL, value: status },
                    'card.creatorId': { rule: FilterRules.EQUAL, value: userId },
                    amount: {
                        rule: FilterRules.GTE_LTE,
                        value: { gte: query.amountStart, lte: query.amountEnd },
                    },
                    dateClose: {
                        rule: FilterRules.GTE_LTE,
                        value: { gte: query.dateStart, lte: query.dateEnd },
                    },
                });

                total = await this.transactionsService.getTransactionsCount(filters);
                transactions = await this.getTransactions(filters, pagination.skip, pagination.limit);
                break;
            }
            default:
            {
                // Проверяем количество документов во всех источниках
                const totalInternal = 0;
                const totalTransfers = await this.transfersService.getTransfersCount(filtersTransfers);
                const totalSuccesPurchases = await this.purchasesService.getPurchasesCount(filtersSuccesPurchases);
                const totalSuccesTransactions = await this.transactionsService.getTransactionsCount(filtersSuccesTransactions);
                const totalActiveTransactions = await this.transactionsService.getTransactionsCount(filtersActiveTransactions);

                // Вычисляем сколько всего источников, у которых на данной странице есть документы
                const totalsCount = [
                    totalInternal,
                    totalTransfers,
                    totalSuccesPurchases,
                    totalSuccesTransactions,
                    totalActiveTransactions,
                ].filter(item => (item - pagination.skip) !== 0).length;
                // Вычисляем отдельный лимит для источников
                const limit = pagination.limit / totalsCount;
                // Вычисляем отдельный шаг для источников
                const skip = getPagination(query.page, limit).skip;

                let transactionsInternal = [];
                let transactionsTransfers = [];
                let transactionsSuccesPurchases = [];
                let transactionsSuccesTransactions = [];
                let transactionsActiveTransactions = [];

                if (totalInternal) {
                    transactionsInternal = [];
                }

                if (totalTransfers) {
                    transactionsTransfers = await this.getTransfers(filtersTransfers, skip, limit);
                }

                if (totalSuccesPurchases) {
                    transactionsSuccesPurchases = await this.getPurchases(filtersSuccesPurchases, skip, limit);
                }

                if (totalSuccesTransactions) {
                    transactionsSuccesTransactions = await this.getTransactions(filtersSuccesTransactions, skip, limit);
                }

                if (totalActiveTransactions) {
                    transactionsActiveTransactions = await this.getTransactions(filtersActiveTransactions, skip, limit);
                }

                transactions = [
                    ...transactionsInternal,
                    ...transactionsTransfers,
                    ...transactionsSuccesPurchases,
                    ...transactionsSuccesTransactions,
                    ...transactionsActiveTransactions,
                ];
                break;
            }
        }

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data: transactions,
        };
    }

    private async getPurchases(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
        const data = await this.purchasesService.getPurchasesCollection(filters, skip, limit);

        return data.map(item => ({
            transactionId: item.purchaseId,
            paymentId: '',
            status: BALANCE_STATUSES.Deposit,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getTransactions(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
        const data = await this.transactionsService.getTransactionsCollection(filters, skip, limit);

        return data.map(item => ({
            transactionId: item.transactionId,
            paymentId: '',
            status: item.status === TRANSACTION_STATUSES.Active ? BALANCE_STATUSES.Freeze : BALANCE_STATUSES.Deduction,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getTransfers(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
        const data = await this.transfersService.getTransfersCollection(filters, skip, limit);

        return data.map(item => ({
            transactionId: item.transferId,
            paymentId: item.hashId,
            status: BALANCE_STATUSES.Deposit,
            amount: item.amount,
            date: item.dateCreate,
        }));
    }
}