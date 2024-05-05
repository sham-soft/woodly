import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigSchema } from './schemas/config.schema';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'configs', schema: ConfigSchema, collection: 'configs' },
    ])],
    providers: [ConfigsService],
    controllers: [ConfigsController],
    exports: [ConfigsService],
})
export class ConfigsModule {}