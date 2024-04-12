import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserQueryDto } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private userModel: Model<User>,
    ) {}

    async getUsers(query: UserQueryDto) {
        const limit = 50;
        let skip = 0;

        const filters = {
            cardLastNumber: query.cardLastNumber,
        };

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countUsers = await this.userModel.countDocuments(filters);

        const data = await this.userModel.find(filters).skip(skip).limit(limit);

        return {
            total: countUsers,
            page: query.page || 1,
            limit: 50,
            users: data,
        };
    }
}