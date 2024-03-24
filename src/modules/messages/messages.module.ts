import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageSchema } from './schemas/message.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'messages', schema: MessageSchema, collection: 'messages' },
  ])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}