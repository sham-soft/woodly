import { IsNotEmpty, IsNumber } from 'class-validator';

export class CardChangeStatusDto {
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @IsNumber()
    @IsNotEmpty()
    status: number;
}