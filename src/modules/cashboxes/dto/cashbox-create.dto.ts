import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { getEnumIntValues } from '../../../helpers/enum';
import { COMISSION_PAYERS } from '../../../helpers/constants';

export class CashboxCreateDto {
    @IsString()
    title: string;

    @IsString()
    url: string;

    @IsString()
    successUrl: string;

    @IsString()
    errorUrl: string;

    @IsString()
    notificationUrlPayments: string;

    @IsString()
    notificationUrlPayOff: string;

    @IsNumber()
    @IsIn(getEnumIntValues(COMISSION_PAYERS))
    commissionPayer: number;

    @IsString()
    @IsOptional()
    apiKey?: string;
}