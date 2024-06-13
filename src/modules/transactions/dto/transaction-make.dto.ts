import { IsOptional, IsNumber, IsString } from 'class-validator';

export class TransactionMakeDto {
    @IsString()
    cardLastNumber: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    message: string;
}