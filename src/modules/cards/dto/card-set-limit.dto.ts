import { IsNumber } from 'class-validator';

export class CardSetLimitDto {
    @IsNumber()
    cardId: number;

    @IsNumber()
    paymentsLimitPerDay: number;

    @IsNumber()
    transactionsLimitPerDay: number;

    @IsNumber()
    paymentMin: number;

    @IsNumber()
    paymentMax: number;
}