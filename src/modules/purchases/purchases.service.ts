import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PurchaseQueryDto } from './dto/purchase.dto';
import { PurchaseCreateDto } from './dto/purchase-create.dto';
import { PurchaseChangeStatusDto } from './dto/purchase-change-status.dto';
import { Purchase } from './schemas/purchase.schema';
import { PURCHASE_STATUSES } from '../../helpers/constants';
import { getСurrentDateToString } from '../../helpers/date';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
    ) {}

    async getPurchases(query: PurchaseQueryDto) {
        const limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countPurchases = await this.purchaseModel.countDocuments();

        const data = await this.purchaseModel.find().skip(skip).limit(limit);

        return {
            total: countPurchases,
            page: query.page || 1,
            limit: 50,
            purchases: data,
        };
    }

    async createPurchase(params: PurchaseCreateDto): Promise<Purchase> {
        const sortPurchases = await this.purchaseModel.find().sort({ purchaseId: -1 }).limit(1);
        const purchaseId = sortPurchases[0]?.purchaseId || 0;

        const payload = {
            purchaseId: purchaseId + 1,
            status: PURCHASE_STATUSES.Available,
            dateCreate: getСurrentDateToString(),
            ...params,
        };

        const newPurchase = new this.purchaseModel(payload);
        newPurchase.save();

        return newPurchase;
    }

    changeStatusCard(params: PurchaseChangeStatusDto): Promise<Purchase> {
        return this.purchaseModel.findOneAndUpdate(
            { purchaseId: params.purchaseId },
            { $set: { status: params.status } }, 
            { new: true }
        );
    }
}