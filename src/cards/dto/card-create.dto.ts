export class CardCreateDto {
    readonly title: string;
    readonly cardNumber: string;
    readonly fio: string;
    readonly bankType: number;
    readonly processMethod: number;
    readonly currency: number;
    readonly deviceId: string;
    readonly apiKey: string;
    readonly slotSim: number;
    readonly isQiwi: boolean;
    readonly isSbp: boolean;
    readonly phone: string;
    readonly recipient: string;
}