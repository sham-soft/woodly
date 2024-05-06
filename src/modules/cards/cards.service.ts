import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Card } from './schemas/card.schema';
import { CardQueryDto } from './dto/card.dto';
import { CardTransactionsQueryDto } from './dto/card-transactions.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { CardChangeStatusDto } from './dto/card-change-status.dto';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { getPagination } from '../../helpers/pagination';
import { getQueryFilters, QueryFilterRules } from '../../helpers/filters';
import { CARD_STATUSES, TRANSACTION_STATUSES } from '../../helpers/constants';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        @InjectModel('transactions') private transactionModel: Model<Transaction>,
    ) {}

    async getCards(query: CardQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const extraFilters = getQueryFilters(query, {
            status: QueryFilterRules.EQUAL,
            cardNumber: QueryFilterRules.REGEX_STRING,
        });
        const filters = {
            status: { $nin: [CARD_STATUSES.Deleted] },
            ...extraFilters,
        };

        const count = await this.cardModel.countDocuments(filters);
        const data = await this.cardModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: count,
            page: pagination.page,
            limit: pagination.limit,
            cards: data,
        };
    }

    async createCard(params: CardCreateDto): Promise<Card> {
        const sortCards = await this.cardModel.find().sort({ cardId: -1 }).limit(1);
        const cardId = sortCards[0]?.cardId || 0;

        const payload = {
            title: params.title,
            cardId: cardId + 1,
            cardNumber: params.cardNumber,
            fio: params.fio,
            bankType: params.bankType,
            processMethod: params.processMethod,
            currency: params.currency,
            deviceId: params.deviceId,
            apiKey: params.apiKey,
            slotSim: params.slotSim,
            isQiwi: params.isQiwi,
            isSbp: params.isSbp,
            phone: params.phone,
            recipient: params.recipient,
            turnoverPaymentsPerDay: 0,
            turnoverTransactionsPerDay: 0,
            paymentsLimitPerDay: 1000000,
            transactionsLimitPerDay: 1000,
            paymentMin: 100,
            paymentMax: 1000000,
            status: CARD_STATUSES.Active,
            cardLastNumber: params.cardNumber.slice(-4),
        };

        const card = await this.cardModel.findOne({ cardLastNumber: payload.cardLastNumber });

        if (card) {
            throw new BadRequestException('Карта с такими цифрами на конце уже существует');
        }

        const newCard = new this.cardModel(payload);
        newCard.save();

        return newCard;
    }

    async editCard(params: CardEditDto): Promise<Card> {
        const payload = {
            title: params.title,
            cardNumber: params.cardNumber,
            fio: params.fio,
            bankType: params.bankType,
            processMethod: params.processMethod,
            currency: params.currency,
            deviceId: params.deviceId,
            apiKey: params.apiKey,
            slotSim: params.slotSim,
            isQiwi: params.isQiwi,
            isSbp: params.isSbp,
            phone: params.phone,
            recipient: params.recipient,
            cardLastNumber: params.cardNumber.slice(-4),
        };

        const card = await this.cardModel.findOne({ cardId: { $ne: params.cardId }, cardLastNumber: payload.cardLastNumber });

        if (card) {
            throw new BadRequestException('Карта с такими цифрами на конце уже существует');
        }

        return this.cardModel.findOneAndUpdate(
            { cardId: params.cardId },
            { $set: payload }, 
            { new: true }
        );
    }

    async setLimitCard(params: CardSetLimitDto): Promise<Card> {
        const payload = {
            paymentsLimitPerDay: params.paymentsLimitPerDay,
            transactionsLimitPerDay: params.transactionsLimitPerDay,
            paymentMin: params.paymentMin,
            paymentMax: params.paymentMax,
        };

        return this.cardModel.findOneAndUpdate(
            { cardId: params.cardId },
            { $set: payload }, 
            { new: true }
        );
    }

    changeStatusCard(params: CardChangeStatusDto): Promise<Card> {
        return this.cardModel.findOneAndUpdate(
            { cardId: params.cardId },
            { $set: { status: params.status } }, 
            { new: true }
        );
    }

    async getCardTransactions(cardId: number, query: CardTransactionsQueryDto): Promise<any> {
        const pagination = getPagination(query.page);

        const filters = {
            cardId: cardId,
            status: TRANSACTION_STATUSES.Successful,
        };

        const count = await this.transactionModel.countDocuments(filters);
        const data = await this.transactionModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            total: count,
            page: pagination.page,
            limit: pagination.limit,
            transactions: data,
        };
    }
}