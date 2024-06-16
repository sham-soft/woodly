import { IsString } from 'class-validator';

export class PurchaseExportQueryDto {
    cashboxIds?: number[];

    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;
}