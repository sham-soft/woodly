import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessageQueryDto } from './dto/message.dto';
import { getPagination } from '../../helpers/pagination';
import { getQueryFilters, QueryFilterRules } from '../../helpers/filters';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('messages') private messageModel: Model<Message>,
    ) {}

    async getMessages(query: MessageQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const filters = getQueryFilters(query, {
            cardLastNumber: QueryFilterRules.EQUAL,
        });

        const count = await this.messageModel.countDocuments(filters);
        const data = await this.messageModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: count,
            page: pagination.page,
            limit: pagination.limit,
            messages: data,
        };
    }
}