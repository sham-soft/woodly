import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Autopayment } from './schemas/autopayment.schema';
import { AutopaymentQueryDto } from './dto/autopayment.dto';
import { getPagination } from '../../helpers/pagination';
import { getQueryFilters, QueryFilterRules } from '../../helpers/filters';

@Injectable()
export class AutopaymentsService {
    constructor(
        @InjectModel('autopayments') private autopaymentModel: Model<Autopayment>,
    ) {}

    async getAutopayments(query: AutopaymentQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const filters = getQueryFilters(query, {
            cardLastNumber: QueryFilterRules.EQUAL,
        });

        const count = await this.autopaymentModel.countDocuments(filters);
        const data = await this.autopaymentModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: count,
            page: pagination.page,
            limit: pagination.limit,
            autopayments: data,
        };
    }
}