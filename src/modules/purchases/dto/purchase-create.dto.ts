import { IsString, IsNumber, Length, IsIn } from 'class-validator';
import { getEnumIntValues } from '../../../helpers/enum';
import { PAYMENT_SYSTEMS, BANK_TYPES, CURRENCIES } from '../../../helpers/constants';

export class PurchaseCreateDto {
    @IsNumber()
    cashbox: number;

    @IsNumber()
    @IsIn(getEnumIntValues(PAYMENT_SYSTEMS))
    paymentSystem: number;

    @IsNumber()
    @IsIn(getEnumIntValues(BANK_TYPES))
    bankType: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    orderNumber: number;

    @IsString()
    @IsIn(Object.values(CURRENCIES))
    currency: string;

    @Length(11, 16)
    @IsString()
    requisites: string;
}