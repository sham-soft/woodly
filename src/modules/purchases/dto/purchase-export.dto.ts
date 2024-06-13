import { IsString } from 'class-validator';

export class PurchaseExportQueryDto {
    cashboxes?: number[];

    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;
}