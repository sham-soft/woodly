import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigDto } from './dto/config.dto';
import { Config } from './schemas/config.schema';

@Injectable()
export class ConfigsService {
    constructor(
        @InjectModel('configs') private configModel: Model<Config>,
    ) {}

    async getConfigs(name: string): Promise<string> {
        const config = await this.configModel.findOne({ name });

        if (config) {
            return config.value;
        }

        throw new BadRequestException('Такой надстройки не существует');
    }

    async setConfigs(params: ConfigDto): Promise<Config> {
        return this.configModel.findOneAndUpdate(
            { name: params.name },
            { $set: { value: params.value } }, 
            { new: true }
        );
    }
}