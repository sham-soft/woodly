import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    userId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ userId: 1 }, { unique : true });