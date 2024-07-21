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
import { TRANSACTION_STATUSES, CASHBOX_TARIFFS, PAYMENT_SYSTEMS } from '../../../helpers/constants';

@Injectable()
export class CreateTransactionService {
    constructor(
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly cashboxesService: CashboxesService,
    ) {}

    async createTransaction(params: TransactionCreateDto): Promise<Transaction> {
        const cashbox = await this.getCashbox(params.cashboxId);

        const newTransactionId = await createId(this.transactionModel, 'transactionId');

        const cashboxTariffId = params.paymentSystem === PAYMENT_SYSTEMS.Card ? CASHBOX_TARIFFS.P2p : CASHBOX_TARIFFS.SbpTransaction;
        const tariff = cashbox.tariffs.find(item => item.tariffId === cashboxTariffId);

        const payload = {
            transactionId: newTransactionId,
            commission: getPercentOfValue(tariff.commissionPercent, params.amount),
            amountMinusCommission: getSumWithoutPercent(tariff.commissionPercent, params.amount),
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