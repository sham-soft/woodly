import { IsString, IsArray, IsEmail, Length, IsIn } from 'class-validator';
import { ROLES } from '../../../helpers/constants';

export class UserCreateDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    login: string;

    @Length(3, 16)
    @IsString()
    password: string;
    
    @IsString()
    @IsIn(Object.values(ROLES))
    role: string;

    @IsArray()
    permissions: string[];
}