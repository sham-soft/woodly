import { IsNumber } from 'class-validator';

export class TransactionEditDto {
    @IsNumber()
    transactionId: number;

    @IsNumber()
    cardId: number;

    @IsNumber()
    amount: number;
}