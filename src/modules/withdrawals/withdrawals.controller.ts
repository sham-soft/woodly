import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Body,
    Post,
    Patch,
    Query,
    Param,
    Request,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { Withdrawal } from './schemas/withdrawal.schema';
import { WithdrawalQueryDto } from './dto/withdrawal.dto';
import { WithdrawalCreateDto } from './dto/withdrawal-create.dto';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
    constructor(private readonly withdrawalsService: WithdrawalsService) {}

    @ApiOperation({ summary: 'Получение списка всех операций выводов' })
    @RequireRoles(ROLES.Admin, ROLES.Merchant)
    @Get()
    getAllWithdrawals(@Query() query: WithdrawalQueryDto): Promise<PaginatedList<Withdrawal>> {
        return this.withdrawalsService.getAllWithdrawals(query);
    }

    @ApiOperation({ summary: 'Создание вывода' })
    @RequireRoles(ROLES.Trader, ROLES.Merchant)
    @Post('create')
    createWithdrawal(@Body() withdrawalDto: WithdrawalCreateDto, @Request() req: CustomRequest): Promise<Withdrawal> {
        return this.withdrawalsService.createWithdrawal(withdrawalDto, req.user.userId);
    }

    @ApiOperation({ summary: 'Подтвердить вывод' })
    @RequireRoles(ROLES.Admin)
    @Patch('confirm/:id')
    confirmWithdrawal(@Param('id') id: number): Promise<void> {
        return this.withdrawalsService.confirmWithdrawal(id);
    }
}