import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CardChangeStatusDto {
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}