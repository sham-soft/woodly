import { IsNotEmpty, IsNumber } from 'class-validator';

export class CardSetLimitDto {
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @IsNumber()
    turnover: number;

    @IsNumber()
    transactionsLimitPerDay: number;

    @IsNumber()
    paymentMin: number;

    @IsNumber()
    paymentMax: number;
}