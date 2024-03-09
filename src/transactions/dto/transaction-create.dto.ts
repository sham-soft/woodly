import { IsBoolean, IsOptional, ValidateIf, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionCreateDto {
    @IsBoolean()
    @IsOptional()
    isSbp: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ValidateIf(params => !params.isSbp)
    bankType: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}