import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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