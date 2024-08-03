import { IsString, IsNumber } from 'class-validator';

export class SessionCreateDto {
    @IsString()
    ip: string;

    @IsString()
    token: string;

    @IsNumber()
    creatorId: number;
}