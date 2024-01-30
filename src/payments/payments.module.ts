import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentSchema } from './schemas/payment.schema';
import { PaymentInProcessSchema } from './schemas/payment-in-process.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'payments', schema: PaymentSchema, collection: 'payments' },
    { name: 'paymentsInProcess', schema: PaymentInProcessSchema, collection: 'paymentsInProcess' },
  ])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}