import { Injectable, StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { BalanceTransaction } from './types/balance-transaction.type';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import type { BalanceExportQueryDto } from './dto/balance-export.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly getBalanceService: GetBalanceService,
        private readonly getTransactionsService: GetTransactionsService,
        private readonly exportTransactionsService: ExportTransactionsService,
    ) {}

    async getBalance(userId: number): Promise<PaginatedList<BalanceTransaction>> {
        return this.getBalanceService.getBalance(userId);
    }

    async getTransactions(query: BalanceTransactionsQueryDto): Promise<any> {
        return this.getTransactionsService.getTransactions(query);
    }

    async getTransactionsExport(query: BalanceExportQueryDto): Promise<StreamableFile> {
        return this.exportTransactionsService.getTransactionsExport(query);
    }
}