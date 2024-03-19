import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { getСurrentDateToString } from '../../helpers/date';
import { TRANSACTION_STATUSES } from '../../helpers/constants';
import { Card } from '../cards/schemas/card.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    @Cron('0 */4 * * * *')
    async updateActiveTransactions() {        
        const filters = {
            status: TRANSACTION_STATUSES.Active,
            dateClose: { $lt: getСurrentDateToString() },
        };
        
        await this.transactionModel.updateMany(filters, { $set: { status: TRANSACTION_STATUSES.Cancelled } });;
        console.log('Called updateActiveTransactions every 4 minutes');
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async updateTurnoverCards() {                
        await this.cardModel.updateMany({ $set: { turnoverPaymentsPerDay: 0, turnoverTransactionsPerDay: 0 } });;
        console.log('Called updateTurnoverCards every day');
    }
}