import { IsString } from 'class-validator';

export class ConfigDto {
    @IsString()
    name: string;

    @IsString()
    value: string;
}