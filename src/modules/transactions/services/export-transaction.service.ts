import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionExportQueryDto } from '../dto/transaction-export.dto';
import { createXlsx } from '../../../helpers/xlsx';
import { getFilters, FilterRules } from '../../../helpers/filters';
import { ROLES, TRANSACTION_STATUSES, PAYMENT_SYSTEMS } from '../../../helpers/constants';
import type { CustomRequest } from '../../../types/custom-request.type';

// TODO - потом переделать через справочники
const TRANSACTIONS_STATUSES_TRADER_TEXT = {
    Active: 'Активная',
    Verification: 'На проверке',
    Cancelled: 'Отмененная',
    Successful: 'Успешная',
};

const TRANSACTIONS_STATUSES_MERCHANT_TEXT = {
    Active: 'Ожидаем оплату',
    Verification: 'На проверке',
    Cancelled: 'Отменен',
    Successful: 'Выполнен',
};

const PAYMENT_SYSTEM_TEXT = {
    Card: 'Банковская карта',
    SBP: 'СБП',
};

@Injectable()
export class ExportTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async getTransactionsExport(query: TransactionExportQueryDto, user: CustomRequest['user']): Promise<StreamableFile> {
        const filters = getFilters({
            'cashbox.cashboxId': { rule: FilterRules.EQUAL, value: query.cashboxId },
            dateCreate: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
            status: { rule: FilterRules.EQUAL, value: query.status },
        });

        if (user.role === ROLES.Merchant) {
            filters['cashbox.creatorId'] = user.userId;
        }
        if (user.role === ROLES.Trader) {
            filters['card.creatorId'] = user.userId;
        }

        const transactions = await this.transactionModel.find(filters);

        const buf: Uint8Array = createXlsx({
            headers: this.getHeaders(user.role),
            cols: this.getCols(user.role),
            values: this.getValues(transactions, user.role),
        });

        return new StreamableFile(buf);
    }

    private getHeaders(role: string): string[] {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return ['№ сделки', 'Заказ', 'Касса', 'Сумма', 'Зачислено', 'ПС', 'Статус', 'Дата', 'ID платежа', 'Клиент'];

            case ROLES.Trader:
                return ['ID платежа', 'Название и номер карты', 'Сумма', 'Статус', 'Создан', 'Закрытие'];
        }
    }

    private getValues(transactions: Transaction[], role: string): (string | number)[][] {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return transactions.map((item) => [
                    item.transactionId,
                    item.orderNumber,
                    item.cashbox.cashboxId,
                    item.amount + '₽',
                    item.amountMinusCommission + '₽',
                    PAYMENT_SYSTEM_TEXT[PAYMENT_SYSTEMS[item.paymentSystem]],
                    this.getStatusText(item.status, role),
                    item.dateCreate,
                    '???',
                    item.clientNumber,
                ]);

            case ROLES.Trader:
                return transactions.map((item) => [
                    item.transactionId,
                    item.card.cardNumber + ' ' + item.card.title,
                    item.amount + '₽',
                    this.getStatusText(item.status, role),
                    item.dateCreate,
                    item.dateClose,
                ]);
        }
    }

    private getCols(role: string): { wch: number }[] {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return [
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 20 },
                    { wch: 15 },
                    { wch: 30 },
                    { wch: 10 },
                    { wch: 20 },
                ];

            case ROLES.Trader:
                return [ { wch: 10 }, { wch: 35 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 30 } ];
        }
    }

    private getStatusText(statusId: number, role: string): string {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return TRANSACTIONS_STATUSES_MERCHANT_TEXT[TRANSACTION_STATUSES[statusId]];

            case ROLES.Trader:
                return TRANSACTIONS_STATUSES_TRADER_TEXT[TRANSACTION_STATUSES[statusId]];
        }
    }
}