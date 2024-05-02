import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

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