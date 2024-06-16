import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../../users/users.service';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { ConfigsService } from '../../configs/configs.service';
import { getFixedFloat, getSumWithPercent } from '../../../helpers/numbers';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class GetBalanceService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
        private readonly usersService: UsersService,
    ) {}

    async getBalance(userId: number): Promise<any> {
        const balanceData = await Promise.all([
            this.getWallet(),
            this.getUserBalance(userId),
            this.getRates(),
            this.getAmountFreezeTransactions(userId),
        ]);

        const wallet = balanceData[0];
        const userBalance = balanceData[1];
        const rates = balanceData[2];
        const amountFreezeTransactions = balanceData[3];

        const balanceWallet = getFixedFloat((wallet.quantity * rates.rateWithPercent), 2);
        const balance = userBalance + balanceWallet;

        return [
            {
                address: wallet.tokenId,
                balance,
                freeze: amountFreezeTransactions,
                ...rates,
            },
        ];
    }

    private async getWallet(): Promise<any> {
        const params = {
            address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            token: 'Tether USD',
        };

        const wallet = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/account/tokens', { params });
        return wallet.data.data[0];
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
}