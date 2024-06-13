import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class TransactionExportQueryDto {
    @IsNumberString()
    @IsOptional()
    cashbox?: number;

    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;

    @IsNumberString()
    @IsOptional()
    status?: number;
}