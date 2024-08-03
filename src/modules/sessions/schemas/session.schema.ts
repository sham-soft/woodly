import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop()
    ip: string;

    @Prop()
    dateCreate: string;

    @Prop()
    token: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ token: 1 }, { unique : true });