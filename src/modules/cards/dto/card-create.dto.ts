import { IsString, Length, IsBoolean, IsIn } from 'class-validator';
import { getEnumIntValues } from '../../../helpers/enum';
import { BANK_TYPES, PROCESS_METHODS, SIM_SLOTS, CURRENCIES } from '../../../helpers/constants';

export class CardCreateDto {
    @IsString()
    title: string;

    @Length(16, 16)
    @IsString()
    cardNumber: string;

    @IsString()
    fio: string;

    @IsIn(getEnumIntValues(BANK_TYPES))
    bankType: number;

    @IsIn(getEnumIntValues(PROCESS_METHODS))
    processMethod: number;

    @IsIn(Object.values(CURRENCIES))
    currency: string;

    @IsString()
    deviceId: string;

    @IsString()
    apiKey: string;

    @IsIn(getEnumIntValues(SIM_SLOTS))
    slotSim: number;

    @IsBoolean()
    isSbp: boolean;

    phone?: string;

    recipient?: string;
}