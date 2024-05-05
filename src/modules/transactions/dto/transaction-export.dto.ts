import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class TransactionExportQueryDto {
    @IsNumberString()
    @IsOptional()
    cashbox?: number;

    @IsString()
    @IsNotEmpty()
    dateStart: string;

    @IsString()
    @IsNotEmpty()
    dateEnd: string;

    @IsNumberString()
    @IsOptional()
    status?: number;
}