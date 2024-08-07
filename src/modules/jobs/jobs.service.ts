import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { Card } from '../cards/schemas/card.schema';
import { getСurrentDateToString } from '../../helpers/date';
import { TRANSACTION_STATUSES, CURRENCIES } from '../../helpers/constants';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        private readonly httpService: HttpService,
        private readonly currenciesService: CurrenciesService,
        private readonly transactionsService: TransactionsService,
    ) {}

    @Cron('0 */4 * * * *')
    async updateActiveTransactions(): Promise<void> {        
        const filters = {
            status: TRANSACTION_STATUSES.Active,
            dateClose: { $lt: getСurrentDateToString() },
        };
        
        await this.transactionsService.updateTransactionsCollection(filters, {
            status: TRANSACTION_STATUSES.Cancelled,
            dateCancel: getСurrentDateToString(),
        });
        console.log('Called updateActiveTransactions every 4 minutes');
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async updateTurnoverCards(): Promise<void> {                
        await this.cardModel.updateMany({ $set: { turnoverPaymentsPerDay: 0, turnoverTransactionsPerDay: 0 } });
        console.log('Called updateTurnoverCards every day');
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateRubleRate(): Promise<void> {                
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

        const rate = bybitData.data.result.items[2].price;

        this.currenciesService.updateCurrency(CURRENCIES.Rub, rate);
        console.log('Called updateRubleRate every 10 minutes');
    }
}