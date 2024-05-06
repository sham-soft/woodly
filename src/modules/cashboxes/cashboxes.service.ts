import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Cashbox } from './schemas/cashbox.schema';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { getPagination } from '../../helpers/pagination';

@Injectable()
export class CashboxesService {
    constructor(
        @InjectModel('cashboxes') private cashboxModel: Model<Cashbox>,
    ) {}

    async getCashboxes(query: CashboxQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const count = await this.cashboxModel.countDocuments();
        const data = await this.cashboxModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            total: count,
            page: pagination.page,
            limit: pagination.limit,
            cashboxes: data,
        };
    }

    async createCashbox(params: CashboxCreateDto): Promise<Cashbox> {
        const sortCashboxes = await this.cashboxModel.find().sort({ cashboxId: -1 }).limit(1);
        const cashboxId = sortCashboxes[0]?.cashboxId || 0;

        const payload = {
            cashboxId: cashboxId + 1,
            ...params,
        };

        const newCashbox = new this.cashboxModel(payload);
        newCashbox.save();

        return newCashbox;
    }
}