import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigsModule } from './modules/configs/configs.module';
import { CardsModule } from './modules/cards/cards.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigsModule,
        CardsModule,
        TransactionsModule,
        JobsModule,
        ScheduleModule.forRoot(),
        // MongooseModule.forRoot('mongodb://localhost:27017/woodly'),
        MongooseModule.forRoot('mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/woodly'),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}