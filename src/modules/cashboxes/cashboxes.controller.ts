import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
    Post,
    Body,
} from '@nestjs/common';
import { Cashbox } from './schemas/cashbox.schema';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { CashboxesService } from './cashboxes.service';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Cashboxes')
@Controller('cashboxes')
export class CashboxesController {
    constructor(private readonly cashboxesService: CashboxesService) {}

    @ApiOperation({ summary: 'Получение списка касс' })
    @Get()
    getCashboxes(@Query() query: CashboxQueryDto): Promise<PaginatedList<Cashbox>> {
        return this.cashboxesService.getCashboxes(query);
    }

    @ApiOperation({ summary: 'Создание кассы' })
    @Post('create/')
    createCard(@Body() cashboxDto: CashboxCreateDto): Promise<Cashbox> {
        return this.cashboxesService.createCashbox(cashboxDto);
    }
}