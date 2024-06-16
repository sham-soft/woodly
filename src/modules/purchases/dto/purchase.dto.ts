import { IsOptional, IsIn } from 'class-validator';
import { IsInArray } from '../../../validations/is-in-array.validation';
import { getEnumIntValuesToString } from '../../../helpers/enum';
import { PAYMENT_SYSTEMS, PURCHASE_STATUSES, BANK_TYPES } from '../../../helpers/constants';

export class PurchaseQueryDto {
    purchaseId?: number;

    @IsInArray(getEnumIntValuesToString(PAYMENT_SYSTEMS))
    @IsOptional()
    paymentSystem?: number[];

    requisites?: string;

    amount?: number;

    orderNumber?: string;

    @IsIn(getEnumIntValuesToString(BANK_TYPES))
    @IsOptional()
    bankType?: number;

    cashboxId?: number;

    @IsIn(getEnumIntValuesToString(PURCHASE_STATUSES))
    @IsOptional()
    status?: number;

    page?: number;
}