import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { BalanceTransactionsQueryDto } from '../dto/balance-transactions.dto';
import { convertDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES, BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceTransaction } from '../types/balance-transaction.type';

@Injectable()
export class GetTransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
    ) {}

    async getTransactions(query: BalanceTransactionsQueryDto) {
        const limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const transactions = await Promise.all([
            this.getWalletTransactions(),
            this.getSuccessTransactions(),
            this.getActiveTransactions(),
        ]);

        const sortedTransactions =  await this.getSortedTransactions(transactions.flat());

        return {
            total: sortedTransactions.length,
            page: query.page || 1,
            limit: 50,
            transactions: sortedTransactions.slice(skip, limit + skip),
        };
    }

    private async getSuccessTransactions(): Promise<BalanceTransaction[]> {
        const data = await this.transactionModel.find({ status: TRANSACTION_STATUSES.Successful });
        return data.map(item => ({
            transactionId: item.transactionId,
            status: BALANCE_STATUSES.Deduction,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getActiveTransactions(): Promise<BalanceTransaction[]> {
        const data = await this.transactionModel.find({ status: TRANSACTION_STATUSES.Active });
        return data.map(item => ({
            transactionId: item.transactionId,
            status: BALANCE_STATUSES.Freeze,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getWalletTransactions(): Promise<BalanceTransaction[]> {
        const dollarPrice = 81.88;
        const decimals = 1000000;

        const params = {
            address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            trc20Id: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            direction: 0,
        };

        const wallet = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/transfer/trc20', { params });
        return wallet.data.data.map(item => ({
            transactionId: item.hash,
            status: BALANCE_STATUSES.Deposit,
            amount: (item.amount / decimals) * dollarPrice,
            date: convertDateToString(new Date(item.block_timestamp)),
        }));
    }

    private async getSortedTransactions(transactions): Promise<BalanceTransaction[]> {
        return transactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }
}