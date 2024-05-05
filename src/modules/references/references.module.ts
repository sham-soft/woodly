import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReferenceSchema } from './schemas/reference.schema';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'references', schema: ReferenceSchema, collection: 'references' },
    ])],
    providers: [ReferencesService],
    controllers: [ReferencesController],
    exports: [ReferencesService],
})
export class ReferencesModule {}