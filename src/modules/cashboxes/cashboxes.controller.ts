import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Patch,
    Request,
} from '@nestjs/common';
import { Cashbox } from './schemas/cashbox.schema';
import { CashboxQueryDto } from './dto/cashbox.dto';
import { CashboxCreateDto } from './dto/cashbox-create.dto';
import { CashboxChangeStatusDto } from './dto/cashbox-change-status.dto';
import { CashboxesService } from './cashboxes.service';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Cashboxes')
@RequireRoles(ROLES.Admin, ROLES.Operator, ROLES.Merchant)
@Controller('cashboxes')
export class CashboxesController {
    constructor(private readonly cashboxesService: CashboxesService) {}

    @ApiOperation({ summary: 'Получение списка касс' })
    @Get()
    getCashboxes(@Query() query: CashboxQueryDto, @Request() req: CustomRequest): Promise<PaginatedList<Cashbox>> {
        return this.cashboxesService.getCashboxes(query, req.user);
    }

    @ApiOperation({ summary: 'Создание кассы' })
    @Post('create/')
    createCard(@Body() cashboxDto: CashboxCreateDto, @Request() req: CustomRequest): Promise<Cashbox> {
        return this.cashboxesService.createCashbox(cashboxDto, req.user);
    }

    @ApiOperation({
        summary: 'Активация кассы. Деактивация кассы.',
        description: `
            - Чтобы активировать кассу, нужно передать status = 1.
            - Чтобы деактивировать карту, нужно передать status = 2.
        `,
    })
    @Patch('change-status/')
    changeStatusCard(@Body() cardDto: CashboxChangeStatusDto): Promise<Cashbox> {
        return this.cashboxesService.changeStatusCard(cardDto);
    }
}