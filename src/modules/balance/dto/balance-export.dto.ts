import { IsString } from 'class-validator';

export class BalanceExportQueryDto {
    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;
}