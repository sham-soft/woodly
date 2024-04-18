import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PurchaseSchema } from './schemas/purchase.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'purchases', schema: PurchaseSchema, collection: 'purchases' },
  ])],
  providers: [PurchasesService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}