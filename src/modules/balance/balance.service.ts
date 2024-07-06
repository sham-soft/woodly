import { Injectable, StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import { TransfersService } from '../transfers/transfers.service';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';
import type { BalanceTransaction } from './types/balance-transaction.type';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import type { BalanceExportQueryDto } from './dto/balance-export.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly getBalanceService: GetBalanceService,
        private readonly getTransactionsService: GetTransactionsService,
        private readonly exportTransactionsService: ExportTransactionsService,
        private readonly transfersService: TransfersService,
    ) {}

    async getBalance(user: CustomRequest['user']): Promise<PaginatedList<BalanceTransaction>> {
        await this.transfersService.checkAndUpdateTransfers(user.userId);
        return this.getBalanceService.getBalance(user);
    }

    async getTransactions(query: BalanceTransactionsQueryDto, userId: number): Promise<any> {
        await this.transfersService.checkAndUpdateTransfers(userId);
        return this.getTransactionsService.getBalanceTransactions(query, userId);
    }

    async getTransactionsExport(query: BalanceExportQueryDto, userId: number): Promise<StreamableFile> {
        await this.transfersService.checkAndUpdateTransfers(userId);
        return this.exportTransactionsService.getTransactionsExport(query, userId);
    }
}