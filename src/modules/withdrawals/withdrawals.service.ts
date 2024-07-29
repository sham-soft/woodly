import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Withdrawal } from './schemas/withdrawal.schema';
import { WithdrawalQueryDto } from './dto/withdrawal.dto';
import { WithdrawalCreateDto } from './dto/withdrawal-create.dto';
import { UsersService } from '../users/users.service';
import { TransfersService } from '../transfers/transfers.service';
import { createId } from '../../helpers/unique';
import { getPagination } from '../../helpers/pagination';
import { getSumWithPercent, getPercentOfValue } from '../../helpers/numbers';
import { getСurrentDateToString } from '../../helpers/date';
import { ADMIN_ID, WITHDRAWALS_STATUSES, ROLES, TRADER_TARIFFS } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class WithdrawalsService {
    constructor(
        @InjectModel('withdrawals') private withdrawalModel: Model<Withdrawal>,
        private readonly usersService: UsersService,
        private readonly transfersService: TransfersService,
    ) {}

    async getAllWithdrawals(query: WithdrawalQueryDto): Promise<PaginatedList<Withdrawal>> {
        const pagination = getPagination(query.page); 

        const total = await this.withdrawalModel.countDocuments();
        const data = await this.withdrawalModel.find().skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async createWithdrawal(params: WithdrawalCreateDto, userId: number): Promise<Withdrawal> {
        const isAmountOnBalance = await this.checkAmountOnBalance(userId, params.amount);

        if (!isAmountOnBalance) {
            throw new BadRequestException('Не хватает средств, для проведения операции');
        }

        const newWithdrawalId = await createId(this.withdrawalModel, 'withdrawalId');

        const user = await this.usersService.getUser(userId);
        let tariffPercent = 0;

        if (user.role === ROLES.Trader) {
            const tariff = user.tariffs.find(item => item.tariffId === TRADER_TARIFFS.Transfer);
            tariffPercent = tariff?.addPercent || 0;
        }

        const percentOfAmount = getPercentOfValue(tariffPercent, params.amount);
        const amountWithPercent = getSumWithPercent(tariffPercent, params.amount);

        const payload = {
            withdrawalId: newWithdrawalId,
            status: WITHDRAWALS_STATUSES.Waiting,
            dateCreate: getСurrentDateToString(),
            creatorId: userId,
            amountWithPercent,
            ...params,
        };

        const newWithdrawal = new this.withdrawalModel(payload);

        const requests = [
            newWithdrawal.save(),
            // Обновление баланса заказчика. Списание
            this.usersService.updateBalance(userId, -amountWithPercent),
            // Обновление баланса админа. Пополнение
            this.usersService.updateBalance(ADMIN_ID, percentOfAmount),
        ];
        await Promise.all(requests);

        return newWithdrawal;
    }

    async confirmWithdrawal(id: number): Promise<void> {
        const withdrawal = await this.withdrawalModel.findOne({ withdrawalId: id });

        if (!withdrawal) {
            throw new BadRequestException('Вывода с таким id не существует');
        }

        const payload = {
            status: WITHDRAWALS_STATUSES.Sent,
            dateClose: getСurrentDateToString(),
        };

        await this.withdrawalModel.findOneAndUpdate(
            { withdrawalId: id },
            { $set: payload },
        );
    }

    async getWithdrawalsCount(filters: unknown): Promise<number> {
        return this.withdrawalModel.countDocuments(filters);
    }

    async getWithdrawalsCollection(filters: unknown, skip: number, limit: number): Promise<Withdrawal[]> {
        return this.withdrawalModel.find(filters).skip(skip).limit(limit);
    }

    private async checkAmountOnBalance(userId: number, amount: number): Promise<boolean> {
        await this.transfersService.checkAndUpdateTransfers(userId);

        const user = await this.usersService.getUser(userId);
        return (user.balance - amount) > 0;
    }
}