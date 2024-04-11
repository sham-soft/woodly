import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../../transactions/schemas/transaction.schema';

@Injectable()
export class GetBalanceService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
    ) {}

    async getBalance() {
        const balanceData = await Promise.all([
            this.getWallet(),
            this.getRates(),
        ]);

        const wallet = balanceData[0];
        const rates = balanceData[1];

        return {
            tokenId: wallet.tokenId,
            balanceUsdt: wallet.quantity, 
            balanceRub: wallet.quantity * rates.rate, 
            balanceRubWithPercent: wallet.quantity * rates.rateWithPercent, 
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
        const body = {
            tokenId: 'USDT',
            currencyId: 'RUB',
            payment: [],
            side: '1',
            size: '3',
            page: '1',
            amount:'300000',
            authMaker: false,
            canTrade: false,
        };

        const bybitData: any = await this.httpService.axiosRef.post('https://api2.bybit.com/fiat/otc/item/online', body);

        const rate = Number(bybitData.data.result.items[2].price);
        const percentOfRate = 2.5 * 100 / rate;
        const rateWithPercent = parseFloat((rate + percentOfRate).toFixed(2));

        return {
            rate,
            rateWithPercent,
        };
    }
}