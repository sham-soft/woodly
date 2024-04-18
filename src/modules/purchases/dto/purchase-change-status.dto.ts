import { IsNotEmpty, IsNumber } from 'class-validator';

export class PurchaseChangeStatusDto {
    @IsNumber()
    @IsNotEmpty()
    purchaseId: number;

    @IsNumber()
    @IsNotEmpty()
    status: number;
}