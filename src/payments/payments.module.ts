import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentSchema } from './schemas/payment.schema';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'payments', schema: PaymentSchema, collection: 'payments' },
    { name: 'transactions', schema: TransactionSchema, collection: 'transactions' },
  ])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}