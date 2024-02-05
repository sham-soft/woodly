import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'payments', schema: PaymentSchema, collection: 'payments' },
        { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
    ])],
    providers: [TransactionsService],
    controllers: [TransactionsController],
})
export class TransactionsModule {}