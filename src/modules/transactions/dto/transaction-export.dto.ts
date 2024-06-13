import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class TransactionExportQueryDto {
    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;

    @IsNumberString()
    @IsOptional()
    status?: number;
}