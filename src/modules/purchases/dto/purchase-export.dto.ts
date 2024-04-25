import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class PurchaseExportQueryDto {
    @IsOptional()
    cashboxes?: number[];

    @IsString()
    @IsNotEmpty()
    dateStart: string;

    @IsString()
    @IsNotEmpty()
    dateEnd: string;
}