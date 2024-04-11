import { Injectable } from '@nestjs/common';
import { GetBalanceService } from './services/get-balance.service';
import { GetTransactionsService } from './services/get-transactions.service';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly getBalanceService: GetBalanceService,
        private readonly getTransactionsService: GetTransactionsService,
    ) {}

    async getBalance() {
        return this.getBalanceService.getBalance();
    }

    async getTransactions(query: BalanceTransactionsQueryDto) {
        return this.getTransactionsService.getTransactions(query);
    }
}