import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

        type payloadType = {
            status: boolean,
            cardNumber?: { $regex: string },
        }

        const payload: payloadType = {
            status: true,
        };

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        if (query.status === 'false') {
            payload.status = false;
        }

        if (query.cardNumber) {
            payload.cardNumber = { $regex: query.cardNumber };
        }

        const countCards = await this.cardModel.countDocuments(payload);

        const data = await this.cardModel.find(payload).skip(skip).limit(limit);

        return {
            total: countCards,
            page: query.page || 1,
            count: data.length,
            cards: data,
        };
    }

    getCardId(id: string): Promise<Card> {
        return this.cardModel.findOne({ _id: id });
    }

    async createCard(params: CardCreateDto): Promise<Card> {
        const countCards = await this.cardModel.countDocuments();

        const payload = {
            title: params.title,
            cardId: countCards,
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
            status: true,
        };

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
        };

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