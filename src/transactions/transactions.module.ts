import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CardSchema } from '../cards/schemas/card.schema';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'cards', schema: CardSchema, collection: 'cards' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}