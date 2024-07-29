import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalSchema } from './schemas/withdrawal.schema';
import { UsersModule } from '../users/users.module';
import { TransfersModule } from '../transfers/transfers.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'withdrawals', schema: WithdrawalSchema, collection: 'withdrawals' }]),
        UsersModule,
        TransfersModule,
    ],
    providers: [WithdrawalsService],
    controllers: [WithdrawalsController],
    exports: [WithdrawalsService],
})
export class WithdrawalsModule {}