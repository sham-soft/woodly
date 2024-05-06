import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, StreamableFile, BadRequestException } from '@nestjs/common';
import { ExportPurchasesService } from './services/export-purchases.service';
import { Purchase } from './schemas/purchase.schema';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseExportQueryDto } from './dto/purchase-export.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { PurchaseChangeStatusDto } from './dto/purchase-change-status.dto';
import { getPagination } from '../../helpers/pagination';
import { getSumWithPercent } from '../../helpers/numbers';
import { getQueryFilters, QueryFilterRules } from '../../helpers/filters';
import { getСurrentDateToString } from '../../helpers/date';
import { PURCHASE_STATUSES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
        private readonly exportPurchasesService: ExportPurchasesService,
    ) {}

    async getPurchases(query: PurchaseQueryDto): Promise<PaginatedList<Purchase>> {
        const pagination = getPagination(query.page); 

        const filters = getQueryFilters(query, {
            status: QueryFilterRules.EQUAL,
            purchaseId: QueryFilterRules.REGEX_INTEGER,
            paymentSystem: QueryFilterRules.EQUAL_LIST,
            requisites: QueryFilterRules.REGEX_STRING,
            amount: QueryFilterRules.REGEX_INTEGER,
            orderNumber: QueryFilterRules.REGEX_STRING,
            bankType: QueryFilterRules.EQUAL,
            cashbox: QueryFilterRules.EQUAL,
        });

        const total = await this.purchaseModel.countDocuments(filters);
        const data = await this.purchaseModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
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

    async uploadFile(purchaseId: number, file: Express.Multer.File): Promise<void> {
        console.log(file);

        const payload = {
            receipt: 'https://s8.hostingkartinok.com/uploads/images/2015/10/b38ff4bc9f2809eb2cbb00981e00d57e.jpeg',
        };

        const purchase = await this.purchaseModel.findOneAndUpdate(
            { purchaseId: purchaseId },
            { $set: payload }, 
            { new: true }
        );

        if (!purchase) {
            throw new BadRequestException('Выплаты с таким id не существует');
        }
    }
}