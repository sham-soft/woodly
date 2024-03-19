import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionMakeDto {
    @IsNotEmpty()
    cardLastNumber: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}