import { IsBoolean, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class TransactionEditDto {
    @IsNumber()
    @IsNotEmpty()
    transactionId: number;

    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsNumber()
    @IsOptional()
    amount: number;
}