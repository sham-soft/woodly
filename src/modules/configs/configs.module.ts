import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { ConfigSchema } from './schemas/config.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: 'configs', schema: ConfigSchema, collection: 'configs' },
    ])],
    providers: [ConfigsService],
    controllers: [ConfigsController],
})
export class ConfigsModule {}