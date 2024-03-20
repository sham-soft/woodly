import { IsString, IsNotEmpty } from 'class-validator';

export class TransactionExportQueryDto {
    @IsString()
    @IsNotEmpty()
    dateStart: string;

    @IsString()
    @IsNotEmpty()
    dateEnd: string;
}