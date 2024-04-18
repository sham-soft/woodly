import { IsString, IsNumber } from 'class-validator';

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
    commissionPayer: number;
}