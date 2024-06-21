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

    async getTransactions(query: BalanceTransactionsQueryDto): Promise<PaginatedList<BalanceTransaction>> {
        const pagination = getPagination(query.page);
        let total = 0;
        let transactions = [];

        switch (Number(query.status)) {
            case BALANCE_STATUSES.Internal:
                total = 0;
                transactions = [];
                break;

            case BALANCE_STATUSES.Deposit:
                total = await this.getTronscanCount();
                transactions = await this.getTronscanTransactions(pagination.skip, pagination.limit);
                break;

            case BALANCE_STATUSES.Deduction:
            case BALANCE_STATUSES.Freeze:
                const status = Number(query.status) === BALANCE_STATUSES.Deduction ?
                    TRANSACTION_STATUSES.Successful : TRANSACTION_STATUSES.Active;
                const filters = { status };

                total = await this.transactionsService.getTransactionsCount(filters);
                transactions = await this.getWoodlyTransactions(filters, pagination.skip, pagination.limit);
                break;

            default:
            {
                // Проверяем количество документов во всех источниках
                const totalInternal = 0;
                const totalTronscan = await this.getTronscanCount();
                const totalSuccesPurchases = await this.purchasesService.getPurchasesCount({
                    status: PURCHASE_STATUSES.Successful,
                });
                const totalSuccesTransactions = await this.transactionsService.getTransactionsCount({
                    status: TRANSACTION_STATUSES.Successful,
                });
                const totalActiveTransactions = await this.transactionsService.getTransactionsCount({
                    status: TRANSACTION_STATUSES.Active,
                });

                // Вычисляем сколько всего источников, на данной странице есть документы
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
                    transactionsSuccesPurchases = await this.getWoodlyPurchases(filters, skip, limit);
                }

                if (totalSuccesTransactions) {
                    const filters = { status: TRANSACTION_STATUSES.Successful };
                    transactionsSuccesTransactions = await this.getWoodlyTransactions(filters, skip, limit);
                }

                if (totalActiveTransactions) {
                    const filters = { status: TRANSACTION_STATUSES.Active };
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