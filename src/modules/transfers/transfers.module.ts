import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { UpdateTransfersService } from './services/update-transfers.service';
import { TransferSchema } from './schemas/transfer.schema';
import { UsersModule } from '../users/users.module';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'transfers', schema: TransferSchema, collection: 'transfers' }]),
        HttpModule,
        CurrenciesModule,
        UsersModule,
    ],
    providers: [
        TransfersService,
        UpdateTransfersService,
    ],
    controllers: [TransfersController],
    exports: [TransfersService],
})
export class TransfersModule {}