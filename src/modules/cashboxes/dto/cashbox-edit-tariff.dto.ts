import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CashboxEditTariffDto {
    @IsNumber()
    cashboxId: number;

    @IsString()
    tariffId: string;

    @IsNumber()
    @IsOptional()
    limitMin?: number;

    @IsNumber()
    @IsOptional()
    limitMax?: number;

    @IsNumber()
    @IsOptional()
    commissionPercent?: number;

    @IsNumber()
    @IsOptional()
    commissionAmount?: number;
}