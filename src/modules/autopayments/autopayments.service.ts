import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Autopayment } from './schemas/autopayment.schema';
import { AutopaymentQueryDto } from './dto/autopayment.dto';
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class AutopaymentsService {
    constructor(
        @InjectModel('autopayments') private autopaymentModel: Model<Autopayment>,
    ) {}

    async getAutopayments(query: AutopaymentQueryDto): Promise<PaginatedList<Autopayment>> {
        const pagination = getPagination(query.page);

        const filters = getFilters({
            cardLastNumber: { rule: FilterRules.EQUAL, value: query.cardLastNumber },
        });

        const total = await this.autopaymentModel.countDocuments(filters);
        const data = await this.autopaymentModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }
}