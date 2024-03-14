import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CARD_STATUSES } from '@/helpers/constants';
import { CardQueryDto } from './dto/card.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { CardEditDto } from './dto/card-edit.dto';
import { CardSetLimitDto } from './dto/card-set-limit.dto';
import { CardChangeStatusDto } from './dto/card-change-status.dto';
import { Card } from './schemas/card.schema';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
    ) {}

    async getCards(query: CardQueryDto) {
        const limit = 50;
        let skip = 0;

        type filtersType = {
            status: any,
            cardNumber?: { $regex: string },
        }

        const filters: filtersType = {
            status: { $nin: [CARD_STATUSES.Deleted] },
        };

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        if (query.status) {
            filters.status = query.status;
        }

        if (query.cardNumber) {
            filters.cardNumber = { $regex: query.cardNumber };
        }

        const countCards = await this.cardModel.countDocuments(filters);

        const data = await this.cardModel.find(filters).skip(skip).limit(limit);

        return {
            total: countCards,
            page: query.page || 1,
            count: data.length,
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
            turnover: 40000,
            transactionsLimitPerDay: 1000000,
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

        const card = await this.cardModel.findOne({ cardLastNumber: payload.cardLastNumber });

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
            turnover: params.turnover,
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
}