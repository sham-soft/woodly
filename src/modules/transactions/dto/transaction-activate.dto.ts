import { IsBoolean, IsOptional, ValidateIf, IsNumber, IsIn } from 'class-validator';
import { BANK_TYPES } from '../../../helpers/constants';

export class TransactionActivateDto {
    @IsNumber()
    transactionId: number;

    @IsBoolean()
    @IsOptional()
    isSbp?: boolean;

    @IsIn([BANK_TYPES.Sber, BANK_TYPES.Tinkoff])
    @ValidateIf(params => !params.isSbp)
    bankType: number;
}