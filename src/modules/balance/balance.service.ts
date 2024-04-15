import { Injectable, StreamableFile } from '@nestjs/common';
import { GetBalanceService } from './services/get-balance.service';
import { GetTransactionsService } from './services/get-transactions.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import type { BalanceExportQueryDto } from './dto/balance-export.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly getBalanceService: GetBalanceService,
        private readonly getTransactionsService: GetTransactionsService,
        private readonly exportTransactionsService: ExportTransactionsService,
    ) {}

    async getBalance() {
        return this.getBalanceService.getBalance();
    }

    async getTransactions(query: BalanceTransactionsQueryDto) {
        return this.getTransactionsService.getTransactions(query);
    }

    async getTransactionsExport(query: BalanceExportQueryDto): Promise<StreamableFile> {
        return this.exportTransactionsService.getTransactionsExport(query);
    }
}