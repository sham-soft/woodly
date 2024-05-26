import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Cashbox } from './schemas/cashbox.schema';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { CashboxChangeStatusDto } from './dto/cashbox-change-status.dto';
import { createId } from '../../helpers/unique'; 
import { getPagination } from '../../helpers/pagination';
import { CASHBOX_STATUSES } from '../../helpers/constants';
import { ROLES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@Injectable()
export class CashboxesService {
    constructor(
        @InjectModel('cashboxes') private cashboxModel: Model<Cashbox>,
    ) {}

    async getCashboxes(query: CashboxQueryDto, user: CustomRequest['user']): Promise<PaginatedList<Cashbox>> {
        const pagination = getPagination(query.page);

        const filters = user.role === ROLES.Merchant ? { creator: user.userId } : {};

        const total = await this.cashboxModel.countDocuments(filters);
        const data = await this.cashboxModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async createCashbox(params: CashboxCreateDto, user: CustomRequest['user']): Promise<Cashbox> {
        const newCashboxId = await createId(this.cashboxModel, 'cashboxId');

        const payload = {
            cashboxId: newCashboxId,
            creator: user.userId,
            status: CASHBOX_STATUSES.Active,
            ...params,
        };

        const newCashbox = new this.cashboxModel(payload);
        newCashbox.save();

        return newCashbox;
    }

    changeStatusCashbox(params: CashboxChangeStatusDto): Promise<Cashbox> {
        return this.cashboxModel.findOneAndUpdate(
            { cashboxId: params.cashboxId },
            { $set: { status: params.status } }, 
            { new: true }
        );
    }
}