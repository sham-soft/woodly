import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JobsService } from './jobs.service';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { ConfigsModule } from '../configs/configs.module';
import { CardSchema } from '../cards/schemas/card.schema';

@Module({
    imports: [
        ConfigsModule,
        HttpModule,
        MongooseModule.forFeature([
            { name: 'cards', schema: CardSchema, collection: 'cards' },
            { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
        ]),
    ],
    providers: [JobsService],
})
export class JobsModule {}