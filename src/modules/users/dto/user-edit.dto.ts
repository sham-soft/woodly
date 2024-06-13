import { IsString, IsEmail, Length, IsIn, IsNumber, IsNotEmpty } from 'class-validator';
import { ROLES } from '../../../helpers/constants';

export class UserEditDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @Length(3, 16)
    @IsString()
    password: string;
    
    @IsIn(Object.values(ROLES))
    role: string;
}