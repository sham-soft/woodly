import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMakeDto } from '../dto/transaction-make.dto';
import { Message } from '../../messages/schemas/message.schema';
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
    ) {}

    async makeTransaction(params: TransactionMakeDto): Promise<string> {
        if (!params.amount) {
            await this.createMessage(params);
        }

        const transaction = await this.transactionModel.findOne({
            cardLastNumber: params.cardLastNumber,
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

            return 'Операция успешно прошла!';
        }

        await this.createAutopayment(params);
    }

    private async updateCardTurnover(transaction: Transaction): Promise<void> {
        const card = await this.cardModel.findOne({ cardId: transaction.cardId });

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
}