import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CardEditDto {
    @IsNumber()
    @IsNotEmpty()
    cardId: number;

    @IsString()
    title: string;

    @IsString()
    @IsNotEmpty()
    cardNumber: string;

    @IsString()
    fio: string;

    @IsNumber()
    @IsNotEmpty()
    bankType: number;

    @IsNumber()
    processMethod: number;

    @IsNumber()
    currency: number;

    @IsString()
    deviceId: string;

    @IsString()
    apiKey: string;

    @IsNumber()
    slotSim: number;

    @IsBoolean()
    isQiwi: boolean;

    @IsBoolean()
    isSbp: boolean;

    phone: string;

    recipient: string;
}