import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutopaymentsService } from './autopayments.service';
import { AutopaymentsController } from './autopayments.controller';
import { AutopaymentSchema } from './schemas/autopayment.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'autopayments', schema: AutopaymentSchema, collection: 'autopayments' },
  ])],
  providers: [AutopaymentsService],
  controllers: [AutopaymentsController],
})
export class AutopaymentsModule {}