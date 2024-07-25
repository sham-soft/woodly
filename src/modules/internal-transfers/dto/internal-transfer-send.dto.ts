import { IsNumber } from 'class-validator';

export class InternalTransferSendDto {
    @IsNumber()
    recipientId: number;

    @IsNumber()
    amount: number;
}