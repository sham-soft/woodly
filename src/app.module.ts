import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { AutopaymentsModule } from './modules/autopayments/autopayments.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CardsModule } from './modules/cards/cards.module';
import { CashboxesModule } from './modules/cashboxes/cashboxes.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MessagesModule } from './modules/messages/messages.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ReferencesModule } from './modules/references/references.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

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