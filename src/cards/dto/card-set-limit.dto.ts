export class CardSetLimitDto {
    readonly cardId: number;
    readonly turnover: number;
    readonly transactionsLimitPerDay: number;
    readonly paymentMin: number;
    readonly paymentMax: number;
}