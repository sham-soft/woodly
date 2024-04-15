import {
    Controller,
    Get,
    Header,
    Query,
    StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import { BalanceExportQueryDto } from './dto/balance-export.dto';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {}

    @ApiOperation({ summary: 'Получения баланса' })
    @Get()
    getBalance() {
        return this.balanceService.getBalance();
    }

    @ApiOperation({ summary: 'Получения списка операций для раздела баланса' })
    @Get('transactions')
    getTransactions(@Query() transactionQuery: BalanceTransactionsQueryDto) {
        return this.balanceService.getTransactions(transactionQuery);
    }

    @ApiOperation({ summary: 'Экспорт списка операций из раздела баланса' })
    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="BalanceTransactions.xlsx"')
    getTransactionsExport(@Query() exportQuery: BalanceExportQueryDto): Promise<StreamableFile> {
        return this.balanceService.getTransactionsExport(exportQuery);
    }
}