import { Injectable, StreamableFile } from '@nestjs/common';
import { GetTransactionsService } from './services/get-transactions.service';
import { GetTransactionsMerchantService } from './services/get-transactions-merchant.service';
import { GetTransactionsAdminService } from './services/get-transactions-admin.service';
import { GetBalanceService } from './services/get-balance.service';
import { ExportTransactionsService } from './services/export-transactions.service';
import { TransfersService } from '../transfers/transfers.service';
import { ROLES } from '../../helpers/constants';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';
import type { Balance ,BalanceTransaction } from './types/balance.type';
import type { BalanceTransactionsQueryDto } from './dto/balance-transactions.dto';
import type { BalanceExportQueryDto } from './dto/balance-export.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly getBalanceService: GetBalanceService,
        private readonly getTransactionsService: GetTransactionsService,
        private readonly getTransactionsAdminService: GetTransactionsAdminService,
        private readonly getTransactionsMerchantService: GetTransactionsMerchantService,
        private readonly exportTransactionsService: ExportTransactionsService,
        private readonly transfersService: TransfersService,
    ) {}

    async getBalance(user: CustomRequest['user']): Promise<Balance[]> {
        await this.transfersService.checkAndUpdateTransfers(user.userId);
        return this.getBalanceService.getBalance(user);
    }

    async getTransactions(query: BalanceTransactionsQueryDto, user: CustomRequest['user']): Promise<PaginatedList<BalanceTransaction>> {
        await this.transfersService.checkAndUpdateTransfers(user.userId);

        switch (user.role) {
            case ROLES.Merchant:
                return this.getTransactionsMerchantService.getBalanceTransactions(query, user.userId);

            case ROLES.Trader:
                return this.getTransactionsService.getBalanceTransactions(query, user.userId);

            case ROLES.Admin:
                return this.getTransactionsAdminService.getBalanceTransactions(query);
        }
    }

    async getTransactionsExport(query: BalanceExportQueryDto, user: CustomRequest['user']): Promise<StreamableFile> {
        await this.transfersService.checkAndUpdateTransfers(user.userId);
        return this.exportTransactionsService.getTransactionsExport(query, user);
    }
}