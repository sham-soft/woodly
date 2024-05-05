import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('Base request')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @ApiOperation({ summary: 'Hello World' })
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}