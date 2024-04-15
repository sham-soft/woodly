import {
    Controller,
    Get,
    Header,
    Query,
    StreamableFile,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import type { BalanceExportQueryDto } from './dto/balance-export.dto';

@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {}

    @Get()
    getBalance() {
        return this.balanceService.getBalance();
    }

    @Get('transactions')
    getTransactions(@Query() transactionQuery: BalanceTransactionsQueryDto) {
        return this.balanceService.getTransactions(transactionQuery);
    }

    @Get('export/')
    @Header('Content-Disposition', 'attachment; filename="BalanceTransactions.xlsx"')
    getTransactionsExport(@Query() exportQuery: BalanceExportQueryDto): Promise<StreamableFile> {
        return this.balanceService.getTransactionsExport(exportQuery);
    }
}