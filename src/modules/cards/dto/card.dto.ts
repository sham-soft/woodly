import { IsOptional, IsIn } from 'class-validator';
import { getEnumIntValuesToString } from '../../../helpers/enum';
import { CARD_STATUSES } from '../../../helpers/constants';

export class CardQueryDto {
    @IsIn(getEnumIntValuesToString(CARD_STATUSES))
    @IsOptional()
    status?: number;

    cardNumber?: string;

    page?: number;
}