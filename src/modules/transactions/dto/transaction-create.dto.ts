import { IsBoolean, IsOptional, ValidateIf, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionCreateDto {
    @IsNumber()
    orderNumber: number;

    @IsNumber()
    cashbox: number;

    @IsString()
    clientNumber: string;

    @IsBoolean()
    @IsOptional()
    isSbp?: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ValidateIf(params => !params.isSbp)
    bankType: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}