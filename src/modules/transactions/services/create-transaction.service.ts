import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionCreateDto } from '../dto/transaction-create.dto';
import { Cashbox } from '../../cashboxes/schemas/cashbox.schema';
import { CashboxesService } from '../../cashboxes/cashboxes.service';
import { createId } from '../../../helpers/unique';
import { getPercentOfValue, getSumWithoutPercent } from '../../../helpers/numbers';
import { getСurrentDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class CreateTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly cashboxesService: CashboxesService,
    ) {}

    async createTransaction(params: TransactionCreateDto): Promise<Transaction> {
        const cashbox = await this.getCashbox(params.cashboxId);

        const newTransactionId = await createId(this.transactionModel, 'transactionId');

        const ADMIN_PERCENT = 6;

        const payload = {
            transactionId: newTransactionId,
            commission: getPercentOfValue(ADMIN_PERCENT, params.amount),
            amountMinusCommission: getSumWithoutPercent(ADMIN_PERCENT, params.amount),
            status: TRANSACTION_STATUSES.Created,
            dateCreate: getСurrentDateToString(),
            cashbox: {
                cashboxId: cashbox.cashboxId,
                creatorId: cashbox.creatorId,
            },
            ...params,
        };

        const newTransaction = new this.transactionModel(payload);
        newTransaction.save();

        return newTransaction;
    }

    private async getCashbox(cashboxId: number): Promise<Cashbox> {
        const cashbox = await this.cashboxesService.getCashboxesDocument({ cashboxId });

        if (!cashbox) {
            throw new BadRequestException('Нет кассы с id: ' + cashboxId);
        }

        return cashbox;
    }
}