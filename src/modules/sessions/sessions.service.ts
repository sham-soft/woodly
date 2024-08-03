import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import { getPagination } from '../../helpers/pagination';
import { getСurrentDateToString } from '../../helpers/date';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { SessionCreateDto } from './dto/session-create.dto';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel('sessions') private sessionModel: Model<Session>,
    ) {}

    async getAllSessions(query: SessionQueryDto): Promise<PaginatedList<Session>> {
        const pagination = getPagination(query.page); 

        const total = await this.sessionModel.countDocuments();
        const data = await this.sessionModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async getSession(token: string): Promise<Session> {
        return await this.sessionModel.findOne({ token });
    }

    async createSession(params: SessionCreateDto): Promise<Session> {
        const payload = {
            ip: params.ip,
            dateCreate: getСurrentDateToString(),
            token: params.token,
            creatorId: params.creatorId,
        };

        const newSession = new this.sessionModel(payload);
        newSession.save();

        return newSession;
    }

    async deleteAllSessions(creatorId: number, token: string): Promise<void> {
        await this.sessionModel.deleteMany({ creatorId, token: { $nin: [token] } });
    }
}