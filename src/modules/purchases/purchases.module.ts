import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ExportPurchasesService } from './services/export-purchases.service';
import { PurchaseSchema } from './schemas/purchase.schema';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'purchases', schema: PurchaseSchema, collection: 'purchases' },
    ])],
    providers: [
        PurchasesService,
        ExportPurchasesService,
    ],
    controllers: [PurchasesController],
})
export class PurchasesModule {}