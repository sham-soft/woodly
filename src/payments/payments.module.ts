import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'payments', schema: PaymentSchema, collection: 'payments' },
  ])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}