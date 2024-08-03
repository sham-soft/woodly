import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import { getPagination } from '../../helpers/pagination';
import { getСurrentDateToString } from '../../helpers/date';
import type { PaginatedList } from '../../types/paginated-list.type';

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

    async createSession(ip: string, accessToken: string): Promise<Session> {
        const payload = {
            ip: ip,
            dateCreate: getСurrentDateToString(),
            accessToken: accessToken,
        };

        const newSession = new this.sessionModel(payload);
        newSession.save();

        return newSession;
    }
}