export class TransactionQueryDto {
    transactionId?: number;
    
    status?: number;

    title?: string;

    cardNumber?: string;

    amount?: number;

    orderNumber?: number;

    clientNumber?: string;

    cashbox?: number;

    dateEnd?: string;

    page?: number;
}