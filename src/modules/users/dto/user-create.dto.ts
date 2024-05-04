import { IsString, IsEmail, Length, IsIn } from 'class-validator';
import { IsInArray } from '../../../validations/is-in-array.validation';
import { ROLES, PERMISSIONS } from '../../../helpers/constants';

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

    @IsInArray(Object.values(PERMISSIONS))
    permissions: string[];
}