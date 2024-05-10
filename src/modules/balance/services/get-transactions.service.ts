import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { ConfigsService } from '../../configs/configs.service';
import { convertDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES, BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceTransaction } from '../types/balance-transaction.type';
import type { BalanceTransactionsQueryDto } from '../dto/balance-transactions.dto';
import type { PaginatedList } from '../../../types/paginated-list.type';

@Injectable()
export class GetTransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
    ) {}

    async getTransactions(query: BalanceTransactionsQueryDto): Promise<PaginatedList<BalanceTransaction>> {
        let transactions = [];

        let limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        switch (Number(query.status)) {
            case BALANCE_STATUSES.Deposit:
                transactions = await this.getTronscanTransactions(skip, limit);
                break;
            case BALANCE_STATUSES.Deduction:
            case BALANCE_STATUSES.Freeze:
                transactions = await this.getWoodlyTransactions([query.status], skip, limit);
                break;
            default:
                skip = skip / 2;
                limit = limit / 2;

                transactions = await Promise.all([
                    this.getTronscanTransactions(skip, limit),
                    this.getWoodlyTransactions([TRANSACTION_STATUSES.Active, TRANSACTION_STATUSES.Successful], skip, limit),
                ]);
                break;
        }

        const sortedTransactions = this.getSortedTransactions(transactions.flat());

        return {
            page: query.page || 1,
            limit: 50,
            total: sortedTransactions.length,
            data: sortedTransactions,
        };
    }

    private async getWoodlyTransactions(statuses: number[], skip: number, limit: number): Promise<BalanceTransaction[]> {
        const filters = {
            status: { $in: statuses },
        };

        const data = await this.transactionModel.find(filters).skip(skip).limit(limit);
        return data.map(item => ({
            transactionId: item.transactionId,
            status: item.status === TRANSACTION_STATUSES.Active ? BALANCE_STATUSES.Freeze : BALANCE_STATUSES.Deduction,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getTronscanTransactions(skip: number, limit: number): Promise<BalanceTransaction[]> {
        const rate = await this.configsService.getConfigs('RUBLE_RATE');
        const decimals = 1000000;

        const params = {
            address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            trc20Id: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            direction: 0,
            limit: limit,
            start: skip,
        };

        const wallet = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/transfer/trc20', { params });
        return wallet.data.data.map(item => ({
            transactionId: item.hash,
            status: BALANCE_STATUSES.Deposit,
            amount: (item.amount / decimals) * Number(rate),
            date: convertDateToString(new Date(item.block_timestamp)),
        }));
    }

    private getSortedTransactions(transactions: BalanceTransaction[]): BalanceTransaction[] {
        return transactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }

    // TO-DO - код для лучшей пагинации
    // private async getSkipsForTransactions(page: number): Promise<number> {
    //     let skipTronscan = (page - 1) * 25;
    //     let skipWoodly = skipTronscan;

    //     const countFilters = {
    //         status: { $in: [TRANSACTION_STATUSES.Active, TRANSACTION_STATUSES.Successful] },
    //     };
    //     const countWoodlyTransactions = await this.transactionModel.countDocuments(countFilters);

    //     if (countWoodlyTransactions >= skipWoodly) {
    //         skipTronscan = (page - 1) * 50;
    //     }

    //     const params = {
    //         address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
    //     };

    //     const wallet: any = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/accountv2', { params });
    //     const countTronscanTransactions = wallet.transactions;

    //     if (countTronscanTransactions >= skipTronscan) {
    //         skipWoodly = (page - 1) * 50;
    //     }

    //     return 0;
    // }
}