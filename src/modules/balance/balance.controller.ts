import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Header,
    Query,
    Request,
    StreamableFile,
} from '@nestjs/common';
import { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import { BalanceExportQueryDto } from './dto/balance-export.dto';
import { BalanceService } from './balance.service';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';
import type { BalanceTransaction } from './types/balance-transaction.type';

@ApiTags('Balance')
@RequireRoles(ROLES.Trader)
@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {}

    @ApiOperation({ summary: 'Получения баланса' })
    @Get()
    getBalance(@Request() req: CustomRequest): Promise<PaginatedList<BalanceTransaction>> {
        return this.balanceService.getBalance(req.user.userId);
    }

    @ApiOperation({ summary: 'Получения списка операций для раздела баланса' })
    @Get('transactions')
    getTransactions(@Query() transactionQuery: BalanceTransactionsQueryDto, @Request() req: CustomRequest): Promise<any> {
        return this.balanceService.getTransactions(transactionQuery, req.user.userId);
    }

    @ApiOperation({ summary: 'Экспорт списка операций из раздела баланса' })
    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="BalanceTransactions.xlsx"')
    getTransactionsExport(@Query() exportQuery: BalanceExportQueryDto): Promise<StreamableFile> {
        return this.balanceService.getTransactionsExport(exportQuery);
    }
}