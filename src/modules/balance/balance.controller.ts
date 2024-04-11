import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';

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
}