import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashboxesService } from './cashboxes.service';
import { CashboxesController } from './cashboxes.controller';
import { CashboxSchema } from './schemas/cashbox.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'cashboxes', schema: CashboxSchema, collection: 'cashboxes' },
  ])],
  providers: [CashboxesService],
  controllers: [CashboxesController],
})
export class CashboxesModule {}