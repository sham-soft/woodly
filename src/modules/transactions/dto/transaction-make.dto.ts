import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionMakeDto {
    @IsNotEmpty()
    cardLastNumber: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}