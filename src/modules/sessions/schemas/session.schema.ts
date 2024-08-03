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
    accessToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ accessToken: 1 }, { unique : true });