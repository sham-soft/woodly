import {
    Controller,
    Get,
    Param,
    Patch,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigsService } from './configs.service';
import { ConfigDto } from './dto/config.dto';
import { Config } from './schemas/config.schema';

@ApiTags('Configs')
@Controller('configs')
export class ConfigsController {
    constructor(private readonly configsService: ConfigsService) {}

    @ApiOperation({ summary: 'Получение значения конфигурации' })
    @Get(':name')
    getConfigs(@Param('name') name: string): Promise<string> {
        return this.configsService.getConfigs(name);
    }

    @ApiOperation({ summary: 'Изменение значения конфигурации' })
    @Patch(':name')
    setConfigs(@Body() configDto: ConfigDto): Promise<Config> {
        return this.configsService.setConfigs(configDto);
    }
}