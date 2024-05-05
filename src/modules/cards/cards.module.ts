import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CardSchema } from './schemas/card.schema';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'cards', schema: CardSchema, collection: 'cards' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [CardsService],
    controllers: [CardsController],
})
export class CardsModule {}