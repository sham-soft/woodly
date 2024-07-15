import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Param,
    Patch,
    Request,
} from '@nestjs/common';
import { Cashbox } from './schemas/cashbox.schema';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { CashboxesService } from './cashboxes.service';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Cashboxes')
@Controller('cashboxes')
export class CashboxesController {
    constructor(private readonly cashboxesService: CashboxesService) {}

    @ApiOperation({ summary: 'Получение списка касс' })
    @RequireRoles(ROLES.Admin, ROLES.Merchant)
    @Get()
    getCashboxes(@Query() query: CashboxQueryDto, @Request() req: CustomRequest): Promise<PaginatedList<Cashbox>> {
        return this.cashboxesService.getCashboxes(query, req.user);
    }

    @ApiOperation({ summary: 'Создание кассы' })
    @RequireRoles(ROLES.Merchant)
    @Post('create/')
    createCard(@Body() cashboxDto: CashboxCreateDto, @Request() req: CustomRequest): Promise<Cashbox> {
        return this.cashboxesService.createCashbox(cashboxDto, req.user.userId);
    }

    @ApiOperation({ summary: 'Активация кассы' })
    @RequireRoles(ROLES.Admin, ROLES.Merchant)
    @Patch('activate/:id')
    activateCashbox(@Param('id') id: number): Promise<void> {
        return this.cashboxesService.activateCashbox(id);
    }

    @ApiOperation({ summary: 'Деактивация кассы' })
    @RequireRoles(ROLES.Admin, ROLES.Merchant)
    @Patch('deactivate/:id')
    deactivateCashbox(@Param('id') id: number): Promise<void> {
        return this.cashboxesService.deactivateCashbox(id);
    }
}