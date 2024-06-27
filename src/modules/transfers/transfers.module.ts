import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TransferSchema } from './schemas/transfer.schema';
import { UsersModule } from '../users/users.module';
import { ConfigsModule } from '../configs/configs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'transfers', schema: TransferSchema, collection: 'transfers' }]),
        HttpModule,
        ConfigsModule,
        UsersModule,
    ],
    providers: [TransfersService],
    controllers: [TransfersController],
    exports: [TransfersService],
})
export class TransfersModule {}