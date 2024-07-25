import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { InternalTransferSchema } from './schemas/internal-transfer.schema';
import { InternalTransfersService } from './internal-transfers.service';
import { InternalTransfersController } from './internal-transfers.controller';
import { UsersModule } from '../users/users.module';
import { TransfersModule } from '../transfers/transfers.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'internal-transfers', schema: InternalTransferSchema, collection: 'internal-transfers' }]),
        UsersModule,
        TransfersModule,
    ],
    providers: [InternalTransfersService],
    controllers: [InternalTransfersController],
    exports: [InternalTransfersService],
})
export class InternalTransfersModule {}