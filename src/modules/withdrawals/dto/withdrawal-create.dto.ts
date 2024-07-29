import { IsNumber, IsString } from 'class-validator';

export class WithdrawalCreateDto {
    @IsString()
    address: string;

    @IsNumber()
    amount: number;
}