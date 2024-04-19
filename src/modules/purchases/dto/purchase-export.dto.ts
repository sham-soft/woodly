import { IsString, IsNotEmpty } from 'class-validator';

export class PurchaseExportQueryDto {
    @IsString()
    @IsNotEmpty()
    dateStart: string;

    @IsString()
    @IsNotEmpty()
    dateEnd: string;
}