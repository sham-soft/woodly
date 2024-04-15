import { IsString, IsNotEmpty } from 'class-validator';

export class BalanceExportQueryDto {
    @IsString()
    @IsNotEmpty()
    dateStart: string;

    @IsString()
    @IsNotEmpty()
    dateEnd: string;
}