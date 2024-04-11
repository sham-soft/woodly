import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceController } from './balance.controller';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';
import { BalanceService } from './balance.service';
import { GetBalanceService } from './services/get-balance.service';
import { GetTransactionsService } from './services/get-transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'transactions', schema: TransactionSchema, collection: 'transactions' }]),
    HttpModule,
  ],
  providers: [
    BalanceService,
    GetBalanceService,
    GetTransactionsService,
  ],
  controllers: [BalanceController],
})
export class BalanceModule {}