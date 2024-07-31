import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Currency } from './schemas/currency.schema';
import { CurrencyQueryDto } from './dto/currency.dto';
import { getPagination } from '../../helpers/pagination';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class CurrenciesService {
    constructor(
        @InjectModel('currencies') private currencyModel: Model<Currency>,
    ) {}

    async getAllCurrencies(query: CurrencyQueryDto): Promise<PaginatedList<Currency>> {
        const pagination = getPagination(query.page); 

        const total = await this.currencyModel.countDocuments();
        const data = await this.currencyModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async getCurrency(currencyId: string): Promise<Currency> {
        const currency = await this.currencyModel.findOne({ currencyId });

        if (!currency) {
            throw new BadRequestException('Валюты с таким id не существует');
        }

        return currency;
    }

    async updateCurrency(currencyId: string, rate: number): Promise<void> {
        return this.currencyModel.findOneAndUpdate(
            { currencyId },
            { $set: { rate } }, 
            { new: true, upsert: true }
        );
    }
}