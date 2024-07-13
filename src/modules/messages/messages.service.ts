import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessageQueryDto } from './dto/message.dto';
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('messages') private messageModel: Model<Message>,
    ) {}

    async getMessages(query: MessageQueryDto): Promise<PaginatedList<Message>> {
        const pagination = getPagination(query.page);

        const filters = getFilters({
            cardLastNumber: { rule: FilterRules.EQUAL, value: query.cardLastNumber },
        });

        const total = await this.messageModel.countDocuments(filters);
        const data = await this.messageModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }
}