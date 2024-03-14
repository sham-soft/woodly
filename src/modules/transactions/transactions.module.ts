import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSchema } from '@/modules/configs/schemas/config.schema';
import { CardSchema } from '@/modules/cards/schemas/card.schema';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'configs', schema: ConfigSchema, collection: 'configs' },
        { name: 'cards', schema: CardSchema, collection: 'cards' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}