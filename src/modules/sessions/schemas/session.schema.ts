import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
    @Prop()
    ip: string;

    @Prop()
    dateCreate: string;

    @Prop()
    token: string;

    @Prop()
    creatorId: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ token: 1 }, { unique : true });
SessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });