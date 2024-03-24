import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class TransactionMakeDto {
    @IsNotEmpty()
    cardLastNumber: string;

    @IsNumber()
    @IsOptional()
    amount: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}