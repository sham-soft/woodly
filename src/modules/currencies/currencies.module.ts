import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CurrencySchema } from './schemas/currency.schema';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'currencies', schema: CurrencySchema, collection: 'currencies' }]),
    ],
    providers: [CurrenciesService],
    controllers: [CurrenciesController],
    exports: [CurrenciesService],
})
export class CurrenciesModule {}