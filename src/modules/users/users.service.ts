import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private userModel: Model<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find();
    }

    async getUser(name: string) {
        const data = await this.userModel.findOne({ name });

        return data;
    }
}