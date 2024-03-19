import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { CardSchema } from '../cards/schemas/card.schema';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'cards', schema: CardSchema, collection: 'cards' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [JobsService],
})
export class JobsModule {}