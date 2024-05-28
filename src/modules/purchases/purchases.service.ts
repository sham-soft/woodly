import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, StreamableFile, BadRequestException } from '@nestjs/common';
import { ExportPurchasesService } from './services/export-purchases.service';
import { Purchase } from './schemas/purchase.schema';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseExportQueryDto } from './dto/purchase-export.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { createId } from '../../helpers/unique'; 
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

    async createPurchase(params: PurchaseCreateDto, userId: number): Promise<Purchase> {
        const newPurchaseId = await createId(this.purchaseModel, 'purchaseId');
        const debit = getSumWithPercent(4, params.amount);

        const payload = {
            purchaseId: newPurchaseId,
            status: PURCHASE_STATUSES.Available,
            dateCreate: getСurrentDateToString(),
            debit,
            creatorId: userId,
            ...params,
        };

        const newPurchase = new this.purchaseModel(payload);
        newPurchase.save();

        return newPurchase;
    }

    async activatePurchase(id: number, userId: number): Promise<void> {
        await this.purchaseModel.findOneAndUpdate(
            { purchaseId: id },
            { $set: { status: PURCHASE_STATUSES.Active, buyerId: userId } }, 
        );
    }

    async confirmPurchase(id: number): Promise<void> {
        await this.purchaseModel.findOneAndUpdate(
            { purchaseId: id },
            { $set: { status: PURCHASE_STATUSES.Successful, dateClose: getСurrentDateToString() } }, 
        );
    }

    async cancelPurchase(id: number): Promise<void> {
        await this.purchaseModel.findOneAndUpdate(
            { purchaseId: id },
            { $set: { status: PURCHASE_STATUSES.Cancelled, dateClose: getСurrentDateToString() } }, 
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