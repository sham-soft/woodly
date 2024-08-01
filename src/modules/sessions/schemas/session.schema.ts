import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop()
    sessionId: number;

    @Prop()
    ip: string;

    @Prop()
    dateCreate: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ sessionId: 1}, { unique : true });