import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetTransactionsMerchantService } from './services/get-transactions-merchant.service';
import { GetTransactionsAdminService } from './services/get-transactions-admin.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';
import { UsersModule } from '../users/users.module';
import { TransfersModule } from '../transfers/transfers.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { PurchasesModule } from '../purchases/purchases.module';
import { InternalTransfersModule } from '../internal-transfers/internal-transfers.module';
import { ConfigsModule } from '../configs/configs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'transactions', schema: TransactionSchema, collection: 'transactions' }]),
        UsersModule,
        ConfigsModule,
        PurchasesModule,
        TransactionsModule,
        TransfersModule,
        InternalTransfersModule,
        WithdrawalsModule,
    ],
    providers: [
        BalanceService,
        GetBalanceService,
        GetTransactionsService,
        GetTransactionsAdminService,
        GetTransactionsMerchantService,
        ExportTransactionsService,
    ],
    controllers: [BalanceController],
})
export class BalanceModule {}