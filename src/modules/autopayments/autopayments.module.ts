import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AutopaymentSchema } from './schemas/autopayment.schema';
import { AutopaymentsService } from './autopayments.service';
import { AutopaymentsController } from './autopayments.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'autopayments', schema: AutopaymentSchema, collection: 'autopayments' },
    ])],
    providers: [AutopaymentsService],
    controllers: [AutopaymentsController],
})
export class AutopaymentsModule {}