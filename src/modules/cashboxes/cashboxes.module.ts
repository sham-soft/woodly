import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CashboxSchema } from './schemas/cashbox.schema';
import { CashboxesService } from './cashboxes.service';
import { CashboxesController } from './cashboxes.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'cashboxes', schema: CashboxSchema, collection: 'cashboxes' },
    ])],
    providers: [CashboxesService],
    controllers: [CashboxesController],
})
export class CashboxesModule {}