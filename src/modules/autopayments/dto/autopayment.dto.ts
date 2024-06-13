import { IsString } from 'class-validator';

export class AutopaymentQueryDto {
    @IsString()
    cardLastNumber: string;

    page?: number;
}