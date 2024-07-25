import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InternalTransfer } from './schemas/internal-transfer.schema';
import { InternalTransferQueryDto } from './dto/internal-transfer.dto';
import { InternalTransferSendDto } from './dto/internal-transfer-send.dto';
import { UsersService } from '../users/users.service';
import { TransfersService } from '../transfers/transfers.service';
import { createId } from '../../helpers/unique';
import { getPagination } from '../../helpers/pagination';
import { getСurrentDateToString } from '../../helpers/date';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class InternalTransfersService {
    constructor(
        @InjectModel('internal-transfers') private internalTransferModel: Model<InternalTransfer>,
        private readonly usersService: UsersService,
        private readonly transfersService: TransfersService,
    ) {}

    async getAllInternalTransfers(query: InternalTransferQueryDto): Promise<PaginatedList<InternalTransfer>> {
        const pagination = getPagination(query.page); 

        const total = await this.internalTransferModel.countDocuments();
        const data = await this.internalTransferModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async sendMoney(params: InternalTransferSendDto, userId: number): Promise<InternalTransfer> {
        const isAmountOnBalance = await this.checkAmountOnBalance(userId, params.amount);

        if (!isAmountOnBalance) {
            throw new BadRequestException('На балансе нет запрашиваемой суммы');
        }

        const newInternalTransferId = await createId(this.internalTransferModel, 'internalTransferId');

        const payload = {
            internalTransferId: newInternalTransferId,
            dateCreate: getСurrentDateToString(),
            creatorId: userId,
            ...params,
        };

        const newInternalTransfer = new this.internalTransferModel(payload);

        const requests = [
            newInternalTransfer.save(),
            // Обновление баланса отправителя. Списание
            this.usersService.updateBalance(userId, -params.amount),
            // Обновление баланса получателя. Пополнение
            this.usersService.updateBalance(params.recipientId, params.amount),
        ];
        await Promise.all(requests);

        return newInternalTransfer;
    }

    async getInternalTransfersCount(filters: unknown): Promise<number> {
        return this.internalTransferModel.countDocuments(filters);
    }

    async getInternalTransfersCollection(filters: unknown, skip: number, limit: number): Promise<InternalTransfer[]> {
        return this.internalTransferModel.find(filters).skip(skip).limit(limit);
    }

    private async checkAmountOnBalance(userId: number, amount: number): Promise<boolean> {
        await this.transfersService.checkAndUpdateTransfers(userId);

        const user = await this.usersService.getUser(userId);
        return (user.balance - amount) > 0;
    }
}