import { IsString, IsOptional } from 'class-validator';

export class PurchaseExportQueryDto {
    @IsOptional()
    cashboxes?: number[];

    @IsString()
    dateStart: string;

    @IsString()
    dateEnd: string;
}