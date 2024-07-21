import { IsNumber, IsIn, IsOptional } from 'class-validator';
import { CASHBOX_TARIFFS } from '../../../helpers/constants';

export class CashboxEditTariffDto {
    @IsNumber()
    cashboxId: number;

    @IsIn(Object.values(CASHBOX_TARIFFS))
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