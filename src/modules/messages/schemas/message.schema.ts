import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop()
    messageId: number;

    @Prop()
    cardLastNumber: string;

    @Prop()
    sender: string;
    
    @Prop()
    message: string;

    @Prop()
    dateCreate: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ messageId: 1 }, { unique : true });