import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StreamableFile } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { utils, write } from 'xlsx';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { ConfigsService } from '../../configs/configs.service';
import { convertDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES, BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceExportQueryDto } from '../dto/balance-export.dto';
import type { BalanceTransaction } from '../types/balance-transaction.type';

@Injectable()
export class ExportTransactionsService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
    ) {}

    async getTransactionsExport(query: BalanceExportQueryDto): Promise<any> {
        const rate = await this.configsService.getConfigs('RUBLE_RATE');

        const transactions = await Promise.all([
            this.getTronscanTransactions(query, rate),
            this.getWoodlyTransactions(query),
        ]);

        const sortedTransactions = this.getSortedTransactions(transactions.flat());

        const headers = ['ID платежа', 'Тип операции', 'Сумма', 'Валюта', 'Курс'];

        const values = sortedTransactions.map((item) => {
            return [
                item.transactionId,
                item.status,
                item.amount,
                'Рубль',
                rate,
            ];
        });

        const ws = utils.aoa_to_sheet([headers, ...values]);
        ws['!cols'] = [ { wch: 70 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 } ]; 
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');
        const buf = write(wb, {type: 'buffer', bookType: 'xlsx' });

        return new StreamableFile(buf);
    }

    private async getWoodlyTransactions(query: BalanceExportQueryDto): Promise<BalanceTransaction[]> {
        const filters = {
            dateCreate: {
                $gt : query.dateStart,
                $lt : query.dateEnd,
            },
            status: { $in: [TRANSACTION_STATUSES.Active, TRANSACTION_STATUSES.Successful] },
        };

        const data = await this.transactionModel.find(filters);
        return data.map(item => ({
            transactionId: item.transactionId,
            status: item.status === TRANSACTION_STATUSES.Active ? BALANCE_STATUSES.Freeze : BALANCE_STATUSES.Deduction,
            amount: item.amount,
            date: item.dateClose,
        }));
    }

    private async getTronscanTransactions(filters: BalanceExportQueryDto, rate: string): Promise<BalanceTransaction[]> {
        const decimals = 1000000;

        const params = {
            address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            trc20Id: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            direction: 0,
            start_timestamp: new Date(filters.dateStart).getTime(),
            end_timestamp: new Date(filters.dateEnd).getTime(),
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
}