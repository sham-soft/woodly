import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { Purchase } from '../schemas/purchase.schema';
import { PurchaseExportQueryDto } from '../dto/purchase-export.dto';
import { createXlsx } from '../../../helpers/xlsx';
import { getFilters, FilterRules } from '../../../helpers/filters';
import { ROLES, PURCHASE_STATUSES, PAYMENT_SYSTEMS, BANK_TYPES } from '../../../helpers/constants';
import type { CustomRequest } from '../../../types/custom-request.type';

// TODO - потом переделать через справочники
const PURCHASES_STATUSES_TRADER_TEXT = {
    Available: 'Доступная',
    Active: 'Активная',
    Cancelled: 'Отмененная',
    Successful: 'Успешная',
};

const PURCHASES_STATUSES_MERCHANT_TEXT = {
    Available: 'Создана',
    Active: 'Ожидает',
    Cancelled: 'Отменена',
    Successful: 'Отправлена',
};

const PAYMENT_SYSTEM_TEXT = {
    Card: 'Банковская карта',
    SBP: 'СБП',
};

const BANK_TYPE_TEXT = {
    Sber: 'Сбербанк',
    Tinkoff: 'Тинькофф банк',
    Rayfayzen: 'Райфайзен банк',
};

@Injectable()
export class ExportPurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
    ) {}

    async getPurchasesExport(query: PurchaseExportQueryDto, user: CustomRequest['user']): Promise<StreamableFile> {
        const filters = getFilters({
            dateCreate: {
                rule: FilterRules.GTE_LTE,
                value: { gte: query.dateStart, lte: query.dateEnd },
            },
            'cashbox.cashboxId': { rule: FilterRules.EQUAL_LIST, value: query.cashboxIds ? [...query.cashboxIds] : undefined },
        });

        if (user.role === ROLES.Merchant) {
            filters['cashbox.creatorId'] = user.userId;
        }
        if (user.role === ROLES.Trader) {
            filters.buyerId = user.userId;
        }

        const purchases = await this.purchaseModel.find(filters);

        const buf: Uint8Array = createXlsx({
            headers: this.getHeaders(user.role),
            cols: this.getCols(user.role),
            values: this.getValues(purchases, user.role),
        });

        return new StreamableFile(buf);
    }

    private getHeaders(role: string): string[] {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return ['ID платежа', 'Заказ', 'Касса', 'Списано', 'Зачислено', 'Способ выплаты', 'Реквизит', 'Статус', 'Дата'];

            case ROLES.Trader:
                return ['ID платежа', 'Способ выплаты', 'Карта', 'Сумма', 'Статус', 'Создан'];
        }
    }

    private getValues(purchases: Purchase[], role: string): (string | number)[][] {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return purchases.map((item) => [
                    item.purchaseId,
                    item.orderNumber,
                    item.cashbox.cashboxId,
                    item.amountWithTraderBonus + '₽',
                    item.amount + '₽',
                    PAYMENT_SYSTEM_TEXT[PAYMENT_SYSTEMS[item.paymentSystem]],
                    item.requisites + ' ' + BANK_TYPE_TEXT[BANK_TYPES[item.bankType]],
                    this.getStatusText(item.status, role),
                    item.dateCreate,
                ]);

            case ROLES.Trader:
                return purchases.map((item) => [
                    item.purchaseId,
                    PAYMENT_SYSTEM_TEXT[PAYMENT_SYSTEMS[item.paymentSystem]],
                    item.requisites + ' ' + BANK_TYPE_TEXT[BANK_TYPES[item.bankType]],
                    item.amount,
                    this.getStatusText(item.status, role),
                    item.dateCreate,
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
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 40 },
                    { wch: 15 },
                    { wch: 30 },
                ];

            case ROLES.Trader:
                return [ { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 30 } ];
        }
    }

    private getStatusText(statusId: number, role: string): string {
        switch (role) {
            case ROLES.Admin:
            case ROLES.Merchant:
                return PURCHASES_STATUSES_MERCHANT_TEXT[PURCHASE_STATUSES[statusId]];

            case ROLES.Trader:
                return PURCHASES_STATUSES_TRADER_TEXT[PURCHASE_STATUSES[statusId]];
        }
    }
}