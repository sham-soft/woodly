import { IsString, IsEmail, Length, IsIn, IsNumber, IsOptional } from 'class-validator';
import { ROLES } from '../../../helpers/constants';

export class UserEditDto {
    @IsNumber()
    userId: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @Length(3, 16)
    @IsString()
    @IsOptional()
    password?: string;
    
    @IsIn(Object.values(ROLES))
    @IsOptional()
    role?: string;
}