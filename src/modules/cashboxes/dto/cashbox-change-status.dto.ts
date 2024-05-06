import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';
import { CASHBOX_STATUSES } from '../../../helpers/constants';

export class CashboxChangeStatusDto {
    @IsNumber()
    @IsNotEmpty()
    cashboxId: number;

    @IsNumber()
    @IsIn(Object.values(CASHBOX_STATUSES).filter((v) => !isNaN(Number(v))))
    status: number;
}