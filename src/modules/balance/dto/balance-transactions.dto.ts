import { IsOptional, IsIn } from 'class-validator';
import { getEnumIntValuesToString } from '../../../helpers/enum';
import { BALANCE_STATUSES } from '../../../helpers/constants';

export class BalanceTransactionsQueryDto {
    @IsIn(getEnumIntValuesToString(BALANCE_STATUSES))
    @IsOptional()
    status?: number;

    page?: number;
}