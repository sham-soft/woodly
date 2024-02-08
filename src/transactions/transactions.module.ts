import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { TransactionCompletedSchema } from './schemas/transaction-completed.schema';
import { TransactionHistorySchema } from './schemas/transaction-history.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'payments', schema: PaymentSchema, collection: 'payments' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
        { name: 'transactionsCompleted', schema: TransactionCompletedSchema, collection: 'transactionsCompleted' },
        { name: 'transactionsHistory', schema: TransactionHistorySchema, collection: 'transactionsHistory' },
    ])],
    providers: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}