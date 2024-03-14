import {
    Controller,
    Get,
    Param,
    Patch,
    Body,
} from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigDto } from './dto/config.dto';
import { Config } from './schemas/config.schema';

@Controller('configs')
export class ConfigsController {
    constructor(private readonly configsService: ConfigsService) {}

    @Get(':name')
    getConfigs(@Param('name') name: string): Promise<string> {
        return this.configsService.getConfigs(name);
    }

    @Patch(':name')
    setConfigs(@Body() configDto: ConfigDto): Promise<Config> {
        return this.configsService.setConfigs(configDto);
    }
}