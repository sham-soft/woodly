import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UpdateTransfersService } from './services/update-transfers.service';
import { Transfer } from './schemas/transfer.schema';
import { TransferQueryDto } from './dto/transfer.dto';
import { getPagination } from '../../helpers/pagination';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class TransfersService {
    constructor(
        @InjectModel('transfers') private transferModel: Model<Transfer>,
        private readonly updateTransfersService: UpdateTransfersService,
    ) {}

    async getAllTransfers(query: TransferQueryDto): Promise<PaginatedList<Transfer>> {
        const pagination = getPagination(query.page); 

        const total = await this.transferModel.countDocuments();
        const data = await this.transferModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async getTransfersCount(filters: unknown): Promise<number> {
        return this.transferModel.countDocuments(filters);
    }

    async getTransfersCollection(filters: unknown, skip: number, limit: number): Promise<Transfer[]> {
        return this.transferModel.find(filters).skip(skip).limit(limit);
    }

    async checkAndUpdateTransfers(userId: number): Promise<Transfer[]> {
        return this.updateTransfersService.checkAndUpdateTransfers(userId);
    }

}