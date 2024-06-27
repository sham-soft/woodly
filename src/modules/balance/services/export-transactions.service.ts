import { utils, write } from 'xlsx';
import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './get-transactions.service';
import type { BalanceExportQueryDto } from '../dto/balance-export.dto';

@Injectable()
export class ExportTransactionsService {
    constructor(
        private readonly getTransactionsService: GetTransactionsService,
    ) {}

    async getTransactionsExport(query: BalanceExportQueryDto, userId: number): Promise<StreamableFile> {
        const transactions = await this.getTransactionsService.getBalanceTransactions(query, userId);

        const headers = ['ID операции', 'Тип операции', 'Сумма', 'Дата и время'];

        const values = transactions.data.map((item) => [
            item.transactionId,
            item.status,
            item.amount,
            item.date,
        ]);

        const ws = utils.aoa_to_sheet([headers, ...values]);
        ws['!cols'] = [ { wch: 70 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 } ]; 
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');
        const buf = write(wb, {type: 'buffer', bookType: 'xlsx' });

        return new StreamableFile(buf);
    }
}