import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserQueryDto } from './dto/user.dto';
import { UserEditDto } from './dto/user-edit.dto';
import { UserEditTariffDto } from './dto/user-edit-tariff.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { createId } from '../../helpers/unique';
import { getPagination } from '../../helpers/pagination';
import { ROLES, DEFAULT_TRADER_TARIFFS } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private userModel: Model<User>,
    ) {}

    async getAllUsers(query: UserQueryDto): Promise<PaginatedList<User>> {
        const pagination = getPagination(query.page); 

        const total = await this.userModel.countDocuments();
        const data = await this.userModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async getUser(userId: number): Promise<User> {
        const user = await this.userModel.findOne({ userId });

        if (!user) {
            throw new BadRequestException('Пользователя с таким id не существует');
        }

        return user;
    }

    async getUserByLogin(login: string): Promise<User> {
        const data = await this.userModel.findOne({ login });
        return data;
    }

    async createUser(params: UserCreateDto): Promise<User> {
        const user = await this.getUserByLogin(params.login);

        if (user) {
            throw new BadRequestException('Пользователь с таким логином уже существует');
        }

        const newUserId = await createId(this.userModel, 'userId');

        const payload = {
            userId: newUserId,
            isWorkTransactions: true,
            balance: 0,
            tariffs: params.role === ROLES.Trader ? DEFAULT_TRADER_TARIFFS : [],
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

    async switchTransactionsFlag(userId: number, value: boolean): Promise<void> {
        await this.userModel.findOneAndUpdate(
            { userId: userId },
            { $set: { isWorkTransactions: value } }, 
        );
    }

    async editTariff(params: UserEditTariffDto): Promise<User> {
        const user = await this.userModel.findOneAndUpdate(
            { userId: params.userId, 'tariffs.tariffId': params.tariffId },
            { $set: {
                'tariffs.$.limitMin': params.limitMin,
                'tariffs.$.limitMax': params.limitMax,
                'tariffs.$.addPercent': params.addPercent,
                'tariffs.$.addAmount': params.addAmount,
            }}, 
            { new: true }
        );

        if (!user) {
            throw new BadRequestException('Пользователя с таким id не существует');
        }

        return user;
    }

    async updateBalance(userId: number, value: number): Promise<void> {
        await this.userModel.findOneAndUpdate(
            { userId: userId },
            { $inc: { balance: value } }, 
        );
    }

    async getUsersDocument(filters: unknown): Promise<User> {
        return this.userModel.findOne(filters);
    }

    async getUsersCollection(filters: unknown, skip?: number, limit?: number): Promise<User[]> {
        return this.userModel.find(filters).skip(skip).limit(limit);
    }
}