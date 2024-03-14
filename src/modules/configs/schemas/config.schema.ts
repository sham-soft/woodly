import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
    @Prop()
    name: string;
    
    @Prop()
    value: string;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);