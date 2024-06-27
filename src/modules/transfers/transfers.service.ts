import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Transfer } from './schemas/transfer.schema';
import { TransferQueryDto } from './dto/transfer.dto';
import { UsersService } from '../users/users.service';
import { ConfigsService } from '../configs/configs.service';
import { createId } from '../../helpers/unique';
import { getPagination } from '../../helpers/pagination';
import { getSumWithPercent } from '../../helpers/numbers';
import { convertDateToString } from '../../helpers/date';
import { CONFIGS } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class TransfersService {
    constructor(
        @InjectModel('transfers') private transferModel: Model<Transfer>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
        private readonly usersService: UsersService,
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
        const totalTransfers = await this.transferModel.countDocuments();
        const totalTronscan = await this.getTronscanCount();
        const difference = totalTronscan - totalTransfers;

        if (difference) {
            const transactions = await this.getTronscanTransfers(difference, userId);

            const amount = transactions.reduce((prev, item) => prev + item.amount, 0);

            await this.usersService.updateBalance(userId, amount);

            const newTransfers = await this.transferModel.insertMany(transactions);
            return newTransfers;
        }
    
        return [];
    }

    private async getTronscanCount(): Promise<number> {
        const ADDRESS = 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS';

        const params = {
            limit: 0,
            relatedAddress: ADDRESS,
            toAddress: ADDRESS,
        };

        const tronscan = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/filter/trc20/transfers', { params });
        return tronscan.data.total;
    }

    private async getTronscanTransfers(limit: number, userId: number): Promise<Transfer[]> {
        let newTransferId = await createId(this.transferModel, 'transferId');

        const rate = await this.configsService.getConfigs(CONFIGS.RubleRate);
        const RATE_PERCENT = 2.5;
        const rateWithPercent = getSumWithPercent(RATE_PERCENT, Number(rate));
        const DECIMALS = 1000000;
        const ADDRESS = 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS';

        const params = {
            relatedAddress: ADDRESS,
            limit,
            start: 0,
            sort: '-timestamp',
            count: 'true',
            filterTokenValue: 0,
            toAddress: ADDRESS,
        };

        const tronscan = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/filter/trc20/transfers', { params });

        const trsnsfers = tronscan.data?.token_transfers.reverse() || [];
        
        return trsnsfers.map((item: any) => ({
            transferId: newTransferId++,
            hashId: item.transaction_id,
            rate: rate,
            rateWithPercent: rateWithPercent,
            amount: (item.quant / DECIMALS) * Number(rate),
            dateCreate: convertDateToString(new Date(item.block_ts)),
            creatorId: userId,
            address: ADDRESS,
        }));
    }
}