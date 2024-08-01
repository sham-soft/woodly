import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SessionSchema } from './schemas/session.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'sessions', schema: SessionSchema, collection: 'sessions' }]),
    ],
    providers: [SessionsService],
    controllers: [SessionsController],
    exports: [SessionsService],
})
export class SessionsModule {}