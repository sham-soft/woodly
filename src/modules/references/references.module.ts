import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { ReferenceSchema } from './schemas/reference.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'references', schema: ReferenceSchema, collection: 'references' },
    ])],
    providers: [ReferencesService],
    controllers: [ReferencesController],
    exports: [ReferencesService],
})
export class ReferencesModule {}