import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './get-transactions.service';
import { GetTransactionsMerchantService } from './get-transactions-merchant.service';
import { createXlsx } from '../../../helpers/xlsx';
import { BALANCE_STATUSES } from '../../../helpers/constants';
import type { BalanceExportQueryDto } from '../dto/balance-export.dto';

// TODO - потом переделать через справочники
const BALANCE_STATUSES_TRADER_TEXT = {
    Internal: 'Внутренний',
    Deposit: 'Пополнение',
    Deduction: 'Списание',
    Freeze: 'Заморозка',
};

const BALANCE_STATUSES_MERCHANT_TEXT = {
    Internal: 'Внутренний',
    Transaction: 'Платеж',
    Purchase: 'Выплата',
    Withdrawal: 'Вывод',
};

@Injectable()
export class ExportTransactionsService {
    constructor(
        private readonly getTransactionsService: GetTransactionsService,
        private readonly getTransactionsMerchantService: GetTransactionsMerchantService,
    ) {}

    async getTransactionsTraderExport(query: BalanceExportQueryDto, userId: number): Promise<StreamableFile> {
        const transactions = await this.getTransactionsService.getBalanceTransactions(query, userId);

        const values = transactions.data.map((item) => [
            item.transactionId,
            BALANCE_STATUSES_TRADER_TEXT[BALANCE_STATUSES[item.status]],
            item.paymentId,
            item.amount,
            item.date,
        ]);

        const buf: Uint8Array = createXlsx({
            headers: ['ID операции', 'Тип операции', 'ID платежа', 'Сумма', 'Дата и время'],
            cols: [ { wch: 15 }, { wch: 20 }, { wch: 70 }, { wch: 10 }, { wch: 30 } ],
            values,
        });

        return new StreamableFile(buf);
    }

    async getTransactionsMerchantExport(query: BalanceExportQueryDto, userId: number): Promise<StreamableFile> {
        const transactions = await this.getTransactionsMerchantService.getBalanceTransactions(query, userId);

        const values = transactions.data.map((item) => [
            item.transactionId,
            BALANCE_STATUSES_MERCHANT_TEXT[BALANCE_STATUSES[item.status]],
            item.paymentId,
            item.amount,
            item.date,
        ]);

        const buf: Uint8Array = createXlsx({
            headers: ['ID операции', 'Тип операции', 'ID платежа', 'Сумма', 'Дата и время'],
            cols: [ { wch: 15 }, { wch: 20 }, { wch: 70 }, { wch: 10 }, { wch: 30 } ],
            values,
        });

        return new StreamableFile(buf);
    }
}