import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AutopaymentQueryDto } from './dto/autopayment.dto';
import { Autopayment } from './schemas/autopayment.schema';

@Injectable()
export class AutopaymentsService {
    constructor(
        @InjectModel('autopayments') private autopaymentModel: Model<Autopayment>,
    ) {}

    async getAutopayments(query: AutopaymentQueryDto) {
        const limit = 50;
        let skip = 0;

        const filters = {
            cardLastNumber: query.cardLastNumber,
        };

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countAutopayments = await this.autopaymentModel.countDocuments(filters);

        const data = await this.autopaymentModel.find(filters).skip(skip).limit(limit);

        return {
            total: countAutopayments,
            page: query.page || 1,
            limit: 50,
            autopayments: data,
        };
    }
}