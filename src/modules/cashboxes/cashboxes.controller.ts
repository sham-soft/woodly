import {
    Controller,
    Get,
    Query,
    Post,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CashboxesService } from './cashboxes.service';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { Cashbox } from './schemas/cashbox.schema';

@ApiTags('Cashboxes')
@Controller('cashboxes')
export class CashboxesController {
    constructor(private readonly cashboxesService: CashboxesService) {}

    @ApiOperation({ summary: 'Получение списка касс' })
    @Get()
    getCashboxes(@Query() query: CashboxQueryDto) {
        return this.cashboxesService.getCashboxes(query);
    }

    @ApiOperation({ summary: 'Создание кассы' })
    @Post('create/')
    createCard(@Body() cashboxDto: CashboxCreateDto): Promise<Cashbox> {
        return this.cashboxesService.createCashbox(cashboxDto);
    }
}