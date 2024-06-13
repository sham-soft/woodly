import { IsString } from 'class-validator';

export class MessageQueryDto {
    @IsString()
    cardLastNumber: string;

    page?: number;
}