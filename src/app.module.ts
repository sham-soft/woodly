import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
// import { TransactionsModule } from './transactions/transactions.module';

@Module({
    imports: [
        CardsModule,
        // TransactionsModule,
        MongooseModule.forRoot('mongodb://localhost:27017/woodly'),
        // MongooseModule.forRoot('mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/woodly'),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}