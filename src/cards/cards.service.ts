import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CardQueryDto } from './dto/card.dto';
import { CardCreateDto } from './dto/card-create.dto';
import { Card } from './schemas/card.schema';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('cards') private cardModel: Model<Card>,
    ) {}

    async getCards(query: CardQueryDto) {
        const limit = 50;
        let skip = 0;

        if (query.page > 1) {
            skip = (query.page - 1) * 50;
        }

        const countCards = await this.cardModel.countDocuments();

        const data = await this.cardModel.find().skip(skip).limit(limit);

        return {
            total: countCards,
            page: query.page || 1,
            count: data.length,
            data: data,
        };
    }

    getCardId(id: string): Promise<Card> {
        return this.cardModel.findOne({ _id: id });
    }

    async createCard(params: CardCreateDto): Promise<Card | string> {
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

    changeStatusCard(cardId: number, status: boolean): Promise<Card> {
        return this.cardModel.findOneAndUpdate({ cardId: cardId }, { $set: { status: status } },  { new: true });
    }
}