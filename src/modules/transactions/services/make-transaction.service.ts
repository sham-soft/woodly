import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMakeDto } from '../dto/transaction-make.dto';
import { UsersService } from '../../users/users.service';
import { Message } from '../../messages/schemas/message.schema';
import { CashboxesService } from '../../cashboxes/cashboxes.service';
import { Card } from '../../cards/schemas/card.schema';
import { Autopayment } from '../../autopayments/schemas/autopayment.schema';
import { createId } from '../../../helpers/unique';
import { getСurrentDateToString } from '../../../helpers/date';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

@Injectable()
export class MakeTransactionService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('autopayments') private autopaymentModel: Model<Autopayment>,
        @InjectModel('messages') private messageModel: Model<Message>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
        private readonly usersService: UsersService,
        private readonly cashboxesService: CashboxesService,
    ) {}

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        if (!params.amount) {
            await this.createMessage(params);
        }

        const transaction = await this.transactionModel.findOne({
            'card.cardLastNumber': params.cardLastNumber,
            amount: params.amount,
            status: TRANSACTION_STATUSES.Active,
            dateClose: { $gt: getСurrentDateToString() },
        });

        if (transaction) {
            const payloadTransaction = {
                status: TRANSACTION_STATUSES.Successful,
                paymentTime: getСurrentDateToString(),
                message: params.message,
            };

            await this.transactionModel.findOneAndUpdate({ transactionId: transaction.transactionId }, { $set: payloadTransaction });
            await this.updateCardTurnover(transaction);
            await this.updateBalances(transaction, params.amount);

            return 'Операция успешно прошла!';
        }

        await this.createAutopayment(params);
    }

    private async updateCardTurnover(transaction: Transaction): Promise<void> {
        const card = await this.cardModel.findOne({ cardId: transaction.card.cardId });

        const payload = {
            turnoverPaymentsPerDay: card.turnoverPaymentsPerDay + transaction.amount,
            turnoverTransactionsPerDay: card.turnoverTransactionsPerDay + 1,
        };
        
        await this.cardModel.findOneAndUpdate({ cardId: card.cardId }, { $set: payload });
    }
    
    private async createAutopayment(params: TransactionMakeDto): Promise<void> {
        const newAutopaymentId = await createId(this.autopaymentModel, 'autopaymentId');

        const payload: Autopayment = {
            autopaymentId: newAutopaymentId,
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            paymentTime: getСurrentDateToString(),
            message: params.message,
        };

        const transaction = await this.transactionModel.findOne({
            cardLastNumber: params.cardLastNumber,
            amount: params.amount,
            status: TRANSACTION_STATUSES.Cancelled,
        });

        if (transaction) {
            payload.transactionId = transaction.transactionId;
        }

        const newAutopayment = new this.autopaymentModel(payload);
        newAutopayment.save();

        throw new BadRequestException('Операция с такой суммой не найдена. Создан новый автоплатеж.');
    }

    private async createMessage(params: TransactionMakeDto): Promise<void> {
        const newMessageId = await createId(this.messageModel, 'messageId');

        const payload: Message = {
            messageId: newMessageId,
            cardLastNumber: params.cardLastNumber,
            sender: '900',
            dateCreate: getСurrentDateToString(),
            message: params.message,
        };

        const newMessage = new this.messageModel(payload);
        newMessage.save();

        throw new BadRequestException('Операция с такой суммой не найдена. Создано новое общее СМС.');
    }

    private async updateBalances(transaction: Transaction, amount: number): Promise<void> {
        // Обновление баланса трейдера. Списание
        await this.usersService.updateBalance(transaction.card.creatorId, -amount);

        const ADMIN_ID = 1;
        // Обновление баланса админа. Пополнение
        await this.usersService.updateBalance(ADMIN_ID, transaction.commission);

        // Обновление баланса мерчанта. Пополнение
        await this.usersService.updateBalance(transaction.cashbox.creatorId, transaction.amountMinusCommission);

        // Обновление баланса кассы. Пополнение
        await this.cashboxesService.updateBalance(transaction.cashbox.cashboxId, transaction.amountMinusCommission);
    }
}