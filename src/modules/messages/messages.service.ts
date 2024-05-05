import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessageQueryDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('messages') private messageModel: Model<Message>,
    ) {}

    async getMessages(query: MessageQueryDto): Promise<any> {
        const limit = 50;
        let skip = 0;

        const filters = {
            cardLastNumber: query.cardLastNumber,
        };

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countMessages = await this.messageModel.countDocuments(filters);

        const data = await this.messageModel.find(filters).skip(skip).limit(limit);

        return {
            total: countMessages,
            page: query.page || 1,
            limit: 50,
            messages: data,
        };
    }
}