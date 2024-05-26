import { IsString, IsNotEmpty } from 'class-validator';

export class ConfigDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}