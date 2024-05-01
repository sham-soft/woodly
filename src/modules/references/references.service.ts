import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reference } from './schemas/reference.schema';

@Injectable()
export class ReferencesService {
    constructor(
        @InjectModel('references') private referenceModel: Model<Reference>,
    ) {}

    async getAllReference(): Promise<Reference[]> {
        return await this.referenceModel.find();
    }

    async getReference(name: string): Promise<Reference> {
        const reference = await this.referenceModel.findOne({ name });

        if (reference) {
            return reference;
        }

        throw new BadRequestException('Такого справочника не существует');
    }
}