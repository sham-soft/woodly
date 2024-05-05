import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MessageSchema } from './schemas/message.schema';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'messages', schema: MessageSchema, collection: 'messages' },
    ])],
    providers: [MessagesService],
    controllers: [MessagesController],
})
export class MessagesModule {}