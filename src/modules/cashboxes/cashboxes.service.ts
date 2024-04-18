import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { Cashbox } from './schemas/cashbox.schema';

@Injectable()
export class CashboxesService {
    constructor(
        @InjectModel('cashboxes') private cashboxModel: Model<Cashbox>,
    ) {}

    async getCashboxes(query: CashboxQueryDto) {
        const limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countCashboxes = await this.cashboxModel.countDocuments();

        const data = await this.cashboxModel.find().skip(skip).limit(limit);

        return {
            total: countCashboxes,
            page: query.page || 1,
            limit: 50,
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