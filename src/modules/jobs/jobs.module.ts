import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JobsService } from './jobs.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { ConfigsModule } from '../configs/configs.module';
import { CardSchema } from '../cards/schemas/card.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'cards', schema: CardSchema, collection: 'cards' }]),
        ConfigsModule,
        HttpModule,
        TransactionsModule,
    ],
    providers: [JobsService],
})
export class JobsModule {}