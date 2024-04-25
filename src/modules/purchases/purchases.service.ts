import { Model } from 'mongoose';
import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { PurchaseChangeStatusDto } from './dto/purchase-change-status.dto';
import { PurchaseExportQueryDto } from './dto/purchase-export.dto';
import { Purchase } from './schemas/purchase.schema';
import { ExportPurchasesService } from './services/export-purchases.service';
import { PURCHASE_STATUSES } from '../../helpers/constants';
import { getСurrentDateToString } from '../../helpers/date';
import { getPagination, getFilters, FilterRules } from '../../helpers/filters';
import { getSumWithPercent } from '../../helpers/numbers';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
        private readonly exportPurchasesService: ExportPurchasesService,
    ) {}

    async getPurchases(query: PurchaseQueryDto) {
        const pagination = getPagination(query.page); 

        const filters = getFilters(query, {
            status: FilterRules.EQUAL,
            purchaseId: FilterRules.REGEX_INTEGER,
            paymentSystem: FilterRules.EQUAL_LIST,
            requisites: FilterRules.REGEX_STRING,
            amount: FilterRules.REGEX_INTEGER,
            orderNumber: FilterRules.REGEX_STRING,
            bankType: FilterRules.EQUAL,
            cashbox: FilterRules.EQUAL,
        });

        const countPurchases = await this.purchaseModel.countDocuments(filters);
        const data = await this.purchaseModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: countPurchases,
            page: pagination.page,
            limit: pagination.limit,
            purchases: data,
        };
    }

    async createPurchase(params: PurchaseCreateDto): Promise<Purchase> {
        const sortPurchases = await this.purchaseModel.find().sort({ purchaseId: -1 }).limit(1);
        const purchaseId = sortPurchases[0]?.purchaseId || 0;
        const debit = getSumWithPercent(4, params.amount);

        const payload = {
            purchaseId: purchaseId + 1,
            status: PURCHASE_STATUSES.Available,
            dateCreate: getСurrentDateToString(),
            debit,
            ...params,
        };

        const newPurchase = new this.purchaseModel(payload);
        newPurchase.save();

        return newPurchase;
    }

    changeStatusCard(params: PurchaseChangeStatusDto): Promise<Purchase> {
        type PayloadType = {
            status: number;
            dateClose?: string;
        }
        const payload: PayloadType = { status: params.status };

        if ([PURCHASE_STATUSES.Cancelled, PURCHASE_STATUSES.Successful].includes(params.status)) {
            payload.dateClose = getСurrentDateToString();
        }

        return this.purchaseModel.findOneAndUpdate(
            { purchaseId: params.purchaseId },
            { $set: payload }, 
            { new: true }
        );
    }

    async getPurchasesExport(query: PurchaseExportQueryDto): Promise<StreamableFile> {
        return this.exportPurchasesService.getPurchasesExport(query);
    }
}