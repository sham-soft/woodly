import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { PurchasesService } from '../../purchases/purchases.service';
import { ConfigsService } from '../../configs/configs.service';
import { getFixedFloat, getSumWithPercent } from '../../../helpers/numbers';
import { TRANSACTION_STATUSES, PURCHASE_STATUSES, ROLES } from '../../../helpers/constants';
import type { CustomRequest } from '../../../types/custom-request.type';

@Injectable()
export class GetBalanceService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly configsService: ConfigsService,
        private readonly usersService: UsersService,
        private readonly purchasesService: PurchasesService,
    ) {}

    async getBalance(user: CustomRequest['user']): Promise<any> {
        const userId = user.userId;
        const ADDRESS = 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS';
        const requests = [
            this.getUserBalance(userId),
            this.getRates(),
            user.role === ROLES.Trader ? this.getAmountFreezeTransactions(userId) : this.getAmountFreezePurchases(userId),
        ];

        const balanceData = await Promise.all(requests);

        const userBalance = balanceData[0];
        const rates = balanceData[1];
        const amountFreezeTransactions = balanceData[2];

        const balance = getFixedFloat((userBalance - amountFreezeTransactions), 2);

        return [
            {
                address: ADDRESS,
                balance,
                freeze: amountFreezeTransactions,
                ...rates,
            },
        ];
    }

    private async getUserBalance(userId: number): Promise<number> {
        const user = await this.usersService.getUser(userId);
        return user.balance;
    }

    private async getRates(): Promise<any> {
        const RATE_PERCENT = 2.5;

        const config = await this.configsService.getConfigs('RUBLE_RATE');
        const rate = Number(config);
        const rateWithPercent = getSumWithPercent(RATE_PERCENT, rate);

        return {
            rate,
            ratePercent: RATE_PERCENT,
            rateWithPercent,
        };
    }

    private async getAmountFreezeTransactions(userId: number): Promise<number> {
        const data = await this.transactionModel.find({ status: TRANSACTION_STATUSES.Active, 'card.creatorId': userId });
        return data.reduce((prev, item) => prev + item.amount, 0);
    }

    private async getAmountFreezePurchases(userId: number): Promise<number> {
        const filters = {
            status: { $in: [PURCHASE_STATUSES.Available, PURCHASE_STATUSES.Active] },
            creatorId: userId,
        };
        const data = await this.purchasesService.getPurchasesCollection(filters);
        return data.reduce((prev, item) => prev + item.amount, 0);
    }
}