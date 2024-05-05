import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    userId: number;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    login: string;

    @Prop()
    password: string;

    @Prop()
    role: string;

    @Prop()
    permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ userId: 1 }, { unique : true });