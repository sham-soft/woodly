import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { ConfigsModule } from '../configs/configs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'transactions', schema: TransactionSchema, collection: 'transactions' }]),
        HttpModule,
        ConfigsModule,
    ],
    providers: [
        BalanceService,
        GetBalanceService,
        GetTransactionsService,
        ExportTransactionsService,
    ],
    controllers: [BalanceController],
})
export class BalanceModule {}