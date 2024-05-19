import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { createId } from '../../../helpers/unique';
import { getPercentOfValue, getSumWithoutPercent } from '../../../helpers/numbers';
import { getСurrentDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class CreateTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async createTransaction(params: TransactionCreateDto): Promise<Transaction> {
        const newTransactionId = await createId(this.transactionModel, 'transactionId');

        const payload = {
            transactionId: newTransactionId,
            commission: getPercentOfValue(2.5, params.amount),
            amountMinusCommission: getSumWithoutPercent(2.5, params.amount),
            status: TRANSACTION_STATUSES.Created,
            dateCreate: getСurrentDateToString(),
            ...params,
        };

        const newTransaction = new this.transactionModel(payload);
        newTransaction.save();

        return newTransaction;
    }
}