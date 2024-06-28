import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ExportPurchasesService } from './services/export-purchases.service';
import { CreatePurchaseService } from './services/create-purchase.service';
import { PurchaseSchema } from './schemas/purchase.schema';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { UsersModule } from '../users/users.module';
import { CashboxSchema } from '../cashboxes/schemas/cashbox.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'purchases', schema: PurchaseSchema, collection: 'purchases' },
            { name: 'cashboxes', schema: CashboxSchema, collection: 'cashboxes' },
        ]),
        UsersModule,
    ],
    providers: [
        PurchasesService,
        CreatePurchaseService,
        ExportPurchasesService,
    ],
    controllers: [PurchasesController],
    exports: [PurchasesService],
})
export class PurchasesModule {}