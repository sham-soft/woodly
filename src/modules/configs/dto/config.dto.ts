import { IsString, IsNotEmpty } from 'class-validator';
import { EqualValues } from '../validations/equal-values';

export class ConfigDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @EqualValues()
    value: string;
}