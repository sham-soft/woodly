import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { PurchasesModule } from '../purchases/purchases.module';
import { ConfigsModule } from '../configs/configs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'transactions', schema: TransactionSchema, collection: 'transactions' }]),
        HttpModule,
        UsersModule,
        ConfigsModule,
        PurchasesModule,
        TransactionsModule,
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