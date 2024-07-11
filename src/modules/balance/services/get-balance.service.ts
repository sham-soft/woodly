import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { PurchasesService } from '../../purchases/purchases.service';
import { ConfigsService } from '../../configs/configs.service';
import { getFixedFloat, getSumWithPercent } from '../../../helpers/numbers';
import { TRANSACTION_STATUSES, PURCHASE_STATUSES, ROLES } from '../../../helpers/constants';
import type { Balance } from '../types/balance.type';
import type { CustomRequest } from '../../../types/custom-request.type';

@Injectable()
export class GetBalanceService {
    constructor(
        private readonly configsService: ConfigsService,
        private readonly usersService: UsersService,
        private readonly purchasesService: PurchasesService,
        private readonly transactionsService: TransactionsService,
    ) {}

    async getBalance(user: CustomRequest['user']): Promise<Balance[]> {
        const userId = user.userId;
        const ADDRESS = 'TW8RAkPRpxct7NyXU1DZoF8ZHHx6nzzktS';
        const requests = [
            this.getUserBalance(userId),
            this.getRates(),
            this.getAmountFreeze(user),
            user.role === ROLES.Admin ? this.getBalanceAllUsers(ROLES.Trader) : 0,
            user.role === ROLES.Admin ? this.getBalanceAllUsers(ROLES.Merchant) : 0,
        ];

        const balanceData = await Promise.all(requests);

        const userBalance = user.role === ROLES.Admin ? balanceData[0] : balanceData[0] - balanceData[2];
        const rates = balanceData[1];
        const amountFreezeTransactions = balanceData[2];
        const balanceTraders = balanceData[3];
        const balanceMerchants = balanceData[4];

        return [
            {
                address: ADDRESS,
                balance: userBalance,
                freeze: getFixedFloat((amountFreezeTransactions), 2),
                balanceTraders,
                balanceMerchants,
                ...rates,
            },
        ];
    }

    private async getUserBalance(userId: number): Promise<number> {
        const user = await this.usersService.getUser(userId);
        return user.balance;
    }

    private async getRates(): Promise<any> {
        const RATE_PERCENT = 2.5;

        const config = await this.configsService.getConfigs('RUBLE_RATE');
        const rate = Number(config);
        const rateWithPercent = getSumWithPercent(RATE_PERCENT, rate);

        return {
            rate,
            ratePercent: RATE_PERCENT,
            rateWithPercent,
        };
    }

    private async getAmountFreeze(user: CustomRequest['user']): Promise<number> {
        switch (user.role) {
            case ROLES.Merchant:
            {
                const filters = {
                    status: { $in: [PURCHASE_STATUSES.Available, PURCHASE_STATUSES.Active] },
                    creatorId: user.userId,
                };
                const data = await this.purchasesService.getPurchasesCollection(filters);
                return data.reduce((prev, item) => prev + item.amountWithTraderBonus, 0);
            }
            case ROLES.Trader:
            {
                const filters = {
                    status: TRANSACTION_STATUSES.Active,
                    'card.creatorId': user.userId,
                };
                const data = await this.transactionsService.getTransactionsCollection(filters);
                return data.reduce((prev, item) => prev + item.amount, 0);
            }
            case ROLES.Admin:
            {
                const transactions = await this.transactionsService.getTransactionsCollection({ status: TRANSACTION_STATUSES.Active });
                const purchases = await this.purchasesService.getPurchasesCollection({
                    status: { $in: [PURCHASE_STATUSES.Available, PURCHASE_STATUSES.Active] },
                });
        
                const amountTransactions = transactions.reduce((prev, item) => prev + item.amount, 0);
                const amountPurchases = purchases.reduce((prev, item) => prev + item.amountWithTraderBonus, 0);
        
                return amountTransactions + amountPurchases;
            }
        }
    }

    private async getBalanceAllUsers(role: ROLES): Promise<number> {
        const data = await this.usersService.getUsersCollection({ role });
        const balance = data.reduce((prev, item) => prev + item.balance, 0);

        return getFixedFloat((balance), 2);
    }
}