import { IsString, IsNumber, Length, IsNotEmpty } from 'class-validator';

export class PurchaseCreateDto {
    @IsNumber()
    cashbox: number;

    @IsNumber()
    paymentSystem: number;

    @IsNumber()
    bankType: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    orderNumber: number;

    @IsNumber()
    currency: number;

    @Length(16, 16)
    @IsString()
    @IsNotEmpty()
    cardNumber: string;
}