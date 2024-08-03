import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class ProfileEditDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @Length(3, 16)
    @IsString()
    @IsOptional()
    password?: string;
}