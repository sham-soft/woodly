import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';

@Module({
    imports: [PaymentsModule, MongooseModule.forRoot('mongodb://localhost:27017/woodly')],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}