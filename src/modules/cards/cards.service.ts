import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Card } from './schemas/card.schema';
import { CardQueryDto } from './dto/card.dto';
import { CardTransactionsQueryDto } from './dto/card-transactions.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { createId } from '../../helpers/unique'; 
import { getPagination } from '../../helpers/pagination';
import { getFilters, FilterRules } from '../../helpers/filters';
import { CARD_STATUSES, TRANSACTION_STATUSES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
        private readonly transactionsService: TransactionsService,
    ) {}

    async getCards(query: CardQueryDto): Promise<PaginatedList<Card>> {
        const pagination = getPagination(query.page);

        const extraFilters = getFilters({
            status: { rule: FilterRules.EQUAL, value: query.status },
            cardNumber: { rule: FilterRules.REGEX_STRING, value: query.cardNumber },
        });
        const filters = {
            status: { $nin: [CARD_STATUSES.Deleted] },
            ...extraFilters,
        };

        const total = await this.cardModel.countDocuments(filters);
        const data = await this.cardModel.find(filters).skip(pagination.skip).limit(pagination.limit);

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }

    async createCard(params: CardCreateDto, userId: number): Promise<Card> {
        const newCardId = await createId(this.cardModel, 'cardId');

        const payload = {
            title: params.title,
            cardId: newCardId,
            cardNumber: params.cardNumber,
            fio: params.fio,
            bankType: params.bankType,
            processMethod: params.processMethod,
            currency: params.currency,
            deviceId: params.deviceId,
            apiKey: params.apiKey,
            slotSim: params.slotSim,
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
            creatorId: userId,
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

    async activateCard(id: number): Promise<void> {
        await this.cardModel.findOneAndUpdate(
            { cardId: id },
            { $set: { status: CARD_STATUSES.Active } }, 
        );
    }

    async disableCard(id: number): Promise<void> {
        await this.cardModel.findOneAndUpdate(
            { cardId: id },
            { $set: { status: CARD_STATUSES.Inactive } }, 
        );
    }

    async deleteCard(id: number): Promise<void> {
        await this.cardModel.findOneAndUpdate(
            { cardId: id },
            { $set: { status: CARD_STATUSES.Deleted } }, 
        );
    }

    async getCardTransactions(cardId: number, query: CardTransactionsQueryDto): Promise<PaginatedList<Transaction>> {
        const pagination = getPagination(query.page);

        const filters = getFilters({
            cardId: { rule: FilterRules.EQUAL, value: cardId },
            status: { rule: FilterRules.EQUAL, value: TRANSACTION_STATUSES.Successful },
        });

        const total = await this.transactionsService.getTransactionsCount(filters);
        const data = await this.transactionsService.getTransactionsCollection(filters, pagination.skip, pagination.limit);;

        return {
            page: pagination.page,
            limit: pagination.limit,
            total,
            data,
        };
    }
}