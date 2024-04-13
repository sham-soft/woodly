import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { ConfigsService } from '../../configs/configs.service';
import { getFixedFloat } from '../../../helpers/numbers';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class GetBalanceService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
    ) {}

    async getBalance() {
        const balanceData = await Promise.all([
            this.getWallet(),
            this.getRates(),
            this.getAmountActiveTransactions(),
        ]);

        const wallet = balanceData[0];
        const rates = balanceData[1];
        const amountActiveTransactions = balanceData[2];

        const balanceRubWithPercent = getFixedFloat((wallet.quantity * rates.rateWithPercent), 2);

        return {
            tokenId: wallet.tokenId,
            balanceUsdt: wallet.quantity,
            balanceRub: getFixedFloat((wallet.quantity * rates.rate), 2),
            balanceRubWithPercent: balanceRubWithPercent,
            balanceRubFreeze: amountActiveTransactions,
            balanceRubFreezeWithPercent: balanceRubWithPercent - amountActiveTransactions,
            ...rates,
        };
    }

    private async getWallet() {
        const params = {
            address: 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS',
            token: 'Tether USD',
        };

        const wallet = await this.httpService.axiosRef.get('https://apilist.tronscanapi.com/api/account/tokens', { params });
        return wallet.data.data[0];
    }

    private async getRates() {
        const config = await this.configsService.getConfigs('RUBLE_RATE');
        const rate = Number(config);
        const percent = 2.5;
        const percentOfRate = percent * 100 / rate;
        const rateWithPercent = getFixedFloat((rate + percentOfRate), 2);

        return {
            rate,
            rateWithPercent,
        };
    }

    private async getAmountActiveTransactions(): Promise<number> {
        const data = await this.transactionModel.find({ status: TRANSACTION_STATUSES.Active });

        return data.reduce((prev, item) => {
            return prev + item.amount;
        }, 0);
    }
}