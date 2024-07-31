import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { Currency } from './schemas/currency.schema';
import { CurrencyQueryDto } from './dto/currency.dto';
import { CurrenciesService } from './currencies.service';
import { Public } from '../../decorators/public.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Currencies')
@Public()
@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly сurrenciesService: CurrenciesService) {}

    @ApiOperation({ summary: 'Получение списка всех валют' })
    @Get()
    getAllCurrencies(@Query() query: CurrencyQueryDto): Promise<PaginatedList<Currency>> {
        return this.сurrenciesService.getAllCurrencies(query);
    }
}