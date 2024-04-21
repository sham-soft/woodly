export class PurchaseQueryDto {
    purchaseId?: number;

    paymentSystem?: number[];

    cardNumber?: string;

    amount?: number;

    orderNumber?: string;

    bankType?: number;

    cashbox?: number;

    status?: number;

    page?: number;
}