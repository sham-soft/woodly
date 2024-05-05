import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserQueryDto } from './dto/user.dto';
import { UserEditDto } from './dto/user-edit.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { createId } from '../../helpers/unique';
import { getPagination } from '../../helpers/pagination';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private userModel: Model<User>,
    ) {}

    async getAllUsers(query: UserQueryDto): Promise<any> {
        const pagination = getPagination(query.page); 

        const countUsers = await this.userModel.countDocuments();
        const data = await this.userModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            total: countUsers,
            page: pagination.page,
            limit: pagination.limit,
            users: data,
        };
    }

    async getUser(login: string): Promise<User> {
        const data = await this.userModel.findOne({ login });

        return data;
    }

    async createUser(params: UserCreateDto): Promise<User> {
        const newUserId = await createId(this.userModel, 'userId');

        const payload = {
            userId: newUserId,
            ...params,
        };

        const newUser = new this.userModel(payload);
        newUser.save();

        return newUser;
    }

    async editUser(params: UserEditDto): Promise<User> {
        const { userId, ...restParams } = params;

        const user = await this.userModel.findOneAndUpdate(
            { userId: userId },
            { $set: restParams }, 
            { new: true }
        );

        if (!user) {
            throw new BadRequestException('Пользователя с таким id не существует');
        }

        return user;
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.userModel.deleteOne({ userId: id });

        if (!result.deletedCount) {
            throw new BadRequestException('Пользователя с таким id не существует');
        }
    }
}