import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CardSchema } from './schemas/card.schema';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'cards', schema: CardSchema, collection: 'cards' }]),
        TransactionsModule,
    ],
    providers: [CardsService],
    controllers: [CardsController],
})
export class CardsModule {}