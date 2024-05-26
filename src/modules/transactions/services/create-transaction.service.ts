import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { Cashbox } from '../../cashboxes/schemas/cashbox.schema';
import { createId } from '../../../helpers/unique';
import { getPercentOfValue, getSumWithoutPercent } from '../../../helpers/numbers';
import { getСurrentDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class CreateTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        @InjectModel('cashboxes') private cashboxModel: Model<Cashbox>,
    ) {}

    async createTransaction(params: TransactionCreateDto): Promise<Transaction> {
        await this.checkCashbox(params.cashbox);

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

    private async checkCashbox(cashboxId: number): Promise<void> {
        const cashbox = await this.cashboxModel.findOne({ cashboxId });

        if (!cashbox) {
            throw new BadRequestException('Нет кассы с id: ' + cashboxId);
        }
    }
}