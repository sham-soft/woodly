import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Purchase } from '../schemas/purchase.schema';
import { PurchaseCreateDto } from '../dto/purchase-create.dto';
import { Cashbox } from '../../cashboxes/schemas/cashbox.schema';
import { createId } from '../../../helpers/unique';
import { getSumWithPercent } from '../../../helpers/numbers';
import { getСurrentDateToString } from '../../../helpers/date';
import { PURCHASE_STATUSES } from '../../../helpers/constants';

@Injectable()
export class CreatePurchaseService {
    constructor(
        @InjectModel('purchases') private purchaseModel: Model<Purchase>,
        @InjectModel('cashboxes') private cashboxModel: Model<Cashbox>,
    ) {}

    async createPurchase(params: PurchaseCreateDto, userId: number): Promise<Purchase> {
        const cashbox = await this.getCashbox(params.cashboxId);

        const newPurchaseId = await createId(this.purchaseModel, 'purchaseId');
        const debit = getSumWithPercent(4, params.amount);

        const payload = {
            purchaseId: newPurchaseId,
            status: PURCHASE_STATUSES.Available,
            dateCreate: getСurrentDateToString(),
            debit,
            creatorId: userId,
            cashbox: {
                cashboxId: cashbox.cashboxId,
                creatorId: cashbox.creatorId,
            },
            ...params,
        };

        const newPurchase = new this.purchaseModel(payload);
        newPurchase.save();

        return newPurchase;
    }

    private async getCashbox(cashboxId: number): Promise<Cashbox> {
        const cashbox = await this.cashboxModel.findOne({ cashboxId });

        if (!cashbox) {
            throw new BadRequestException('Нет кассы с id: ' + cashboxId);
        }

        return cashbox;
    }
}