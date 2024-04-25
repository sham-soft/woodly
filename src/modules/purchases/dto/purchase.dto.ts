export class PurchaseQueryDto {
    purchaseId?: number;

    paymentSystem?: number[];

    requisites?: string;

    amount?: number;

    orderNumber?: string;

    bankType?: number;

    cashbox?: number;

    status?: number;

    page?: number;
}