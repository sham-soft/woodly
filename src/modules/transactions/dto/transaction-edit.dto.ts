import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class TransactionEditDto {
    @IsNumber()
    @IsNotEmpty()
    transactionId: number;

    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @IsNumber()
    @IsOptional()
    status?: number;

    @IsNumber()
    @IsOptional()
    amount?: number;
}