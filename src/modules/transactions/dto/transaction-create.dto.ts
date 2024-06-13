import { IsIn, IsNumber, IsString } from 'class-validator';
import { getEnumIntValues } from '../../../helpers/enum';
import { PAYMENT_SYSTEMS, CURRENCIES } from '../../../helpers/constants';

export class TransactionCreateDto {
    @IsNumber()
    orderNumber: number;

    @IsNumber()
    cashbox: number;

    @IsIn(getEnumIntValues(PAYMENT_SYSTEMS))
    paymentSystem: number;

    @IsIn(Object.values(CURRENCIES))
    currency: string;

    @IsNumber()
    amount: number;

    @IsString()
    clientNumber: string;
}