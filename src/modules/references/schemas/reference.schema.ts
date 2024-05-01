import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReferenceItem } from '../types/reference-item.type';

export type ReferenceDocument = HydratedDocument<Reference>;

@Schema()
export class Reference {
    @Prop()
    name: string;
    
    @Prop()
    data: ReferenceItem[];
}

export const ReferenceSchema = SchemaFactory.createForClass(Reference);