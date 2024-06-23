import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TransactionsService } from '../../transactions/transactions.service';
import { PurchasesService } from '../../purchases/purchases.service';
import { ConfigsService } from '../../configs/configs.service';
import { getPagination } from '../../../helpers/pagination';
import { convertDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES, PURCHASE_STATUSES, BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceTransaction } from '../types/balance-transaction.type';
import type { BalanceTransactionsQueryDto } from '../dto/balance-transactions.dto';
import type { PaginatedList } from '../../../types/paginated-list.type';

@Injectable()
export class GetTransactionsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
        private readonly purchasesService: PurchasesService,
        private readonly transactionsService: TransactionsService,
    ) {}

    async getTransactions(query: BalanceTransactionsQueryDto, userId: number): Promise<PaginatedList<BalanceTransaction>> {
        const pagination = getPagination(query.page);
        let total = 0;
        let transactions = [];

        switch (Number(query.status)) {
            case BALANCE_STATUSES.Internal:
                total = 0;
                transactions = [];
                break;

            case BALANCE_STATUSES.Deposit:
            {
                // Проверяем количество документов во двух источниках
                const totalTronscan = await this.getTronscanCount();
                const totalSuccesPurchases = await this.purchasesService.getPurchasesCount({
                    status: PURCHASE_STATUSES.Successful,
                    buyerId: userId,
                });
                
                // Вычисляем сколько всего источников, у которых на данной странице есть документы
                const totalsCount = [totalTronscan, totalSuccesPurchases].filter(item => (item - pagination.skip) !== 0).length;

                // Вычисляем отдельный лимит для двух источников
                const limit = pagination.limit / totalsCount;
                // Вычисляем отдельный шаг для двух источников
                const skip = getPagination(query.page, limit).skip;

                let transactionsTronscan = [];
                let transactionsSuccesPurchases = [];

                if (totalTronscan) {
                    transactionsTronscan = await this.getTronscanTransactions(skip, limit);
                }

                if (totalSuccesPurchases) {
                    const filters = { status: PURCHASE_STATUSES.Successful, buyerId: userId };
                    transactionsSuccesPurchases = await this.getWoodlyPurchases(filters, skip, limit);
                }

                transactions = [
                    ...transactionsTronscan,
                    ...transactionsSuccesPurchases,
                ];

                break;
            }
            case BALANCE_STATUSES.Deduction:
            case BALANCE_STATUSES.Freeze:
            {
                const status = Number(query.status) === BALANCE_STATUSES.Deduction ?
                    TRANSACTION_STATUSES.Successful : TRANSACTION_STATUSES.Active;
                const filters = { status, 'card.creatorId': userId };

                total = await this.transactionsService.getTransactionsCount(filters);
                transactions = await this.getWoodlyTransactions(filters, pagination.skip, pagination.limit);
                break;
            }
            default:
            {
                // Проверяем количество документов во всех источниках
                const totalInternal = 0;
                const totalTronscan = await this.getTronscanCount();
                const totalSuccesPurchases = await this.purchasesService.getPurchasesCount({
                    status: PURCHASE_STATUSES.Successful,
                    buyerId: userId,
                });
                const totalSuccesTransactions = await this.transactionsService.getTransactionsCount({
                    status: TRANSACTION_STATUSES.Successful,
                    'card.creatorId': userId,
                });
                const totalActiveTransactions = await this.transactionsService.getTransactionsCount({
                    status: TRANSACTION_STATUSES.Active,
                    'card.creatorId': userId,
                });

                // Вычисляем сколько всего источников, у которых на данной странице есть документы
                const totalsCount = [
                    totalInternal,
                    totalTronscan,
                    totalSuccesPurchases,
                    totalSuccesTransactions,
                    totalActiveTransactions,
                ].filter(item => (item - pagination.skip) !== 0).length;
                // Вычисляем отдельный лимит для источников
                const limit = pagination.limit / totalsCount;
                // Вычисляем отдельный шаг для источников
                const skip = getPagination(query.page, limit).skip;

                let transactionsInternal = [];
                let transactionsTronscan = [];
                let transactionsSuccesPurchases = [];
                let transactionsSuccesTransactions = [];
                let transactionsActiveTransactions = [];

                if (totalInternal) {
                    transactionsInternal = [];
                }

                if (totalTronscan) {
                    transactionsTronscan = await this.getTronscanTransactions(skip, limit);
                }

                if (totalSuccesPurchases) {
                    const filters = { status: PURCHASE_STATUSES.Successful, buyerId: userId };
                    transactionsSuccesPurchases = await this.getWoodlyPurchases(filters, skip, limit);
                }

                if (totalSuccesTransactions) {
                    const filters = { status: TRANSACTION_STATUSES.Successful, 'card.creatorId': userId };
                    transactionsSuccesTransactions = await this.getWoodlyTransactions(filters, skip, limit);
                }

                if (totalActiveTransactions) {
                    const filters = { status: TRANSACTION_STATUSES.Active, 'card.creatorId': userId };
                    transactionsActiveTransactions = await this.getWoodlyTransactions(filters, skip, limit);
                }

                transactions = [
                    ...transactionsInternal,
                    ...transactionsTronscan,
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

    private async getWoodlyPurchases(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
        const data = await this.purchasesService.getPurchasesCollection(filters, skip, limit);

        return data.map(item => ({
            transactionId: item.purchaseId,
            status: BALANCE_STATUSES.Deposit,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getWoodlyTransactions(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
        const data = await this.transactionsService.getTransactionsCollection(filters, skip, limit);

        return data.map(item => ({
            transactionId: item.transactionId,
            status: item.status === TRANSACTION_STATUSES.Active ? BALANCE_STATUSES.Freeze : BALANCE_STATUSES.Deduction,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getTronscanTransactions(skip: number, limit: number): Promise<BalanceTransaction[]> {
        const rate = await this.configsService.getConfigs('RUBLE_RATE');
        const DECIMALS = 1000000;

        const params = {
            relatedAddress: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            limit,
            start: skip,
            sort: '-timestamp',
            count: 'true',
            filterTokenValue: 0,
        };

        const tronscan = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/filter/trc20/transfers', { params });

        return tronscan.data.token_transfers.map((item: any) => ({
            transactionId: item.transaction_id,
            status: BALANCE_STATUSES.Deposit,
            amount: (item.quant / DECIMALS) * Number(rate),
            date: convertDateToString(new Date(item.block_ts)),
        }));
    }

    private async getTronscanCount(): Promise<number> {
        const params = {
            limit: 0,
            relatedAddress: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
        };

        const tronscan = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/filter/trc20/transfers', { params });
        return tronscan.data.total;
    }
}