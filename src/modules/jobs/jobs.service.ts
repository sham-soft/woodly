import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { ConfigDto } from '../configs/dto/config.dto';
import { ConfigsService } from '../configs/configs.service';
import { Card } from '../cards/schemas/card.schema';
import { getСurrentDateToString } from '../../helpers/date';
import { TRANSACTION_STATUSES } from '../../helpers/constants';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly httpService: HttpService,
        private readonly configsService: ConfigsService,
    ) {}

    @Cron('0 */4 * * * *')
    async updateActiveTransactions(): Promise<void> {        
        const filters = {
            status: TRANSACTION_STATUSES.Active,
            dateClose: { $lt: getСurrentDateToString() },
        };
        
        await this.transactionModel.updateMany(filters, { $set: { status: TRANSACTION_STATUSES.Cancelled } });
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

        const params: ConfigDto = {
            name: 'RUBLE_RATE',
            value: rate,
        };

        this.configsService.setConfigs(params);
        console.log('Called updateRubleRate every 10 minutes');
    }
}