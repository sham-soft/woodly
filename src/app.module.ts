import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { UsersModule } from './modules/users/users.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ReferencesModule } from './modules/references/references.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { MessagesModule } from './modules/messages/messages.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { InternalTransfersModule } from './modules/internal-transfers/internal-transfers.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { CashboxesModule } from './modules/cashboxes/cashboxes.module';
import { CardsModule } from './modules/cards/cards.module';
import { BalanceModule } from './modules/balance/balance.module';
import { AutopaymentsModule } from './modules/autopayments/autopayments.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
    imports: [
        AuthModule,
        AutopaymentsModule,
        BalanceModule,
        CardsModule,
        CashboxesModule,
        ConfigsModule,
        JobsModule,
        MessagesModule,
        PurchasesModule,
        ReferencesModule,
        TransactionsModule,
        UsersModule,
        TransfersModule,
        InternalTransfersModule,
        WithdrawalsModule,
        ScheduleModule.forRoot(),
        // MongooseModule.forRoot('mongodb://localhost:27017/woodly'),
        MongooseModule.forRoot('mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/woodly'),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD, // Добавляем guard аутенфикации, глобально
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD, // Добавляем guard проверки ролей, глобально
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}