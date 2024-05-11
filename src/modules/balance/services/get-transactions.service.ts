import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { ConfigsService } from '../../configs/configs.service';
import { getPagination } from '../../../helpers/pagination';
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

                total = await this.transactionModel.countDocuments(filters);
                transactions = await this.getWoodlyTransactions(filters, pagination.skip, pagination.limit);
                break;

            default:
            {
                const filters = {
                    status: { $in: [TRANSACTION_STATUSES.Active, TRANSACTION_STATUSES.Successful] },
                };

                total = await this.transactionModel.countDocuments(filters);
                transactions = await this.getWoodlyTransactions(filters, pagination.skip, pagination.limit);
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

    private async getWoodlyTransactions(filters: unknown, skip: number, limit: number): Promise<BalanceTransaction[]> {
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