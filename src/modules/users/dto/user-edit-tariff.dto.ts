import { IsNumber, IsIn, IsOptional } from 'class-validator';
import { TRADER_TARIFFS } from '../../../helpers/constants';

export class UserEditTariffDto {
    @IsNumber()
    userId: number;

    @IsIn(Object.values(TRADER_TARIFFS))
    tariffId: string;

    @IsNumber()
    @IsOptional()
    limitMin?: number;

    @IsNumber()
    @IsOptional()
    limitMax?: number;

    @IsNumber()
    @IsOptional()
    addPercent?: number;

    @IsNumber()
    @IsOptional()
    addAmount?: number;
}