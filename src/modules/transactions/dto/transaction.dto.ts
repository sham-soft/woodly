import { IsOptional, IsIn } from 'class-validator';
import { getEnumIntValuesToString } from '../../../helpers/enum';
import { TRANSACTION_STATUSES } from '../../../helpers/constants';

export class TransactionQueryDto {
    transactionId?: number;
    
    @IsIn(getEnumIntValuesToString(TRANSACTION_STATUSES))
    @IsOptional()
    status?: number;

    title?: string;

    cardNumber?: string;

    amount?: number;

    orderNumber?: number;

    clientNumber?: string;

    cashboxId?: number;

    dateEnd?: string;

    page?: number;
}