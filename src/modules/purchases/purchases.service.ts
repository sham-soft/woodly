import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, StreamableFile, BadRequestException } from '@nestjs/common';
import { ExportPurchasesService } from './services/export-purchases.service';
import { CreatePurchaseService } from './services/create-purchase.service';
import { Purchase } from './schemas/purchase.schema';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseExportQueryDto } from './dto/purchase-export.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { UsersService } from '../users/users.service';
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import { getСurrentDateToString } from '../../helpers/date';
import { PURCHASE_STATUSES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
        private readonly createPurchaseService: CreatePurchaseService,
        private readonly exportPurchasesService: ExportPurchasesService,
        private readonly usersService: UsersService,
    ) {}

    async getPurchases(query: PurchaseQueryDto): Promise<PaginatedList<Purchase>> {
        const pagination = getPagination(query.page); 

        const filters = getFilters({
            purchaseId: { rule: FilterRules.REGEX_INTEGER, value: query.purchaseId },
            status: { rule: FilterRules.EQUAL, value: query.status },
            bankType: { rule: FilterRules.EQUAL, value: query.bankType },
            paymentSystem: { rule: FilterRules.EQUAL_LIST, value: query.paymentSystem },
            requisites: { rule: FilterRules.REGEX_STRING, value: query.requisites },
            amount: { rule: FilterRules.REGEX_INTEGER, value: query.amount },
            orderNumber: { rule: FilterRules.REGEX_INTEGER, value: query.orderNumber },
            'cashbox.cashboxId': { rule: FilterRules.EQUAL, value: query.cashboxId },
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
        return this.createPurchaseService.createPurchase(params, userId);
    }

    async activatePurchase(id: number, userId: number): Promise<void> {
        await this.purchaseModel.findOneAndUpdate(
            { purchaseId: id },
            { $set: { status: PURCHASE_STATUSES.Active, buyerId: userId } }, 
        );
    }

    async confirmPurchase(id: number, userId: number): Promise<void> {
        const purchase = await this.purchaseModel.findOneAndUpdate(
            { purchaseId: id },
            { $set: { status: PURCHASE_STATUSES.Successful, dateClose: getСurrentDateToString() } }, 
            { new: true }
        );

        if (!purchase) {
            throw new BadRequestException('Выплаты с таким id не существует');
        }

        // Обновление баланса трейдера. Пополнение
        await this.usersService.updateBalance(userId, purchase.amount);
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

    async getPurchasesCount(filters: unknown): Promise<number> {
        return this.purchaseModel.countDocuments(filters);
    }

    async getPurchasesCollection(filters: unknown, skip: number, limit: number): Promise<Purchase[]> {
        return this.purchaseModel.find(filters).skip(skip).limit(limit);
    }
}