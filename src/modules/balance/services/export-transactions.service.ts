import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './get-transactions.service';
import { GetTransactionsMerchantService } from './get-transactions-merchant.service';
import { GetTransactionsAdminService } from './get-transactions-admin.service';
import { createXlsx } from '../../../helpers/xlsx';
import { BALANCE_STATUSES } from '../../../helpers/constants';
import { ROLES } from '../../../helpers/constants';
import type { BalanceExportQueryDto } from '../dto/balance-export.dto';
import type { CustomRequest } from '../../../types/custom-request.type';

// TODO - потом переделать через справочники
const BALANCE_STATUSES_ADMIN_TEXT = {
    Ordered: 'Заказанные выплаты',
    Internal: 'Внутренние',
    Transaction: 'Платежи',
    Purchase: 'Выплаты',
    Sent: 'Отправлено',
    DepositTraders: 'Пополнения трейдеров',
};

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
        private readonly getTransactionsAdminService: GetTransactionsAdminService,
        private readonly getTransactionsMerchantService: GetTransactionsMerchantService,
    ) {}

    async getTransactionsExport(query: BalanceExportQueryDto, user: CustomRequest['user']): Promise<StreamableFile> {
        let transactions = { data: [] };

        switch (user.role) {
            case ROLES.Merchant:
                transactions = await this.getTransactionsMerchantService.getBalanceTransactions(query, user.userId);
                break;

            case ROLES.Trader:
                transactions = await this.getTransactionsService.getBalanceTransactions(query, user.userId);
                break;

            case ROLES.Admin:
                transactions = await this.getTransactionsAdminService.getBalanceTransactions(query);
                break;
        }

        const values = transactions.data.map((item) => [
            item.transactionId,
            this.getStatusText(item.status, user.role),
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

    private getStatusText(statusId: string, role: string): string {
        switch (role) {
            case ROLES.Merchant:
                return BALANCE_STATUSES_MERCHANT_TEXT[BALANCE_STATUSES[statusId]];

            case ROLES.Trader:
                return BALANCE_STATUSES_TRADER_TEXT[BALANCE_STATUSES[statusId]];

            case ROLES.Admin:
                return BALANCE_STATUSES_ADMIN_TEXT[BALANCE_STATUSES[statusId]];
        }
    }
}