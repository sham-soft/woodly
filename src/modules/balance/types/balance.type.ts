export interface Balance {
    address: string;
    balance: number;
    freeze: number;
    rate: number;
    ratePercent: number;
    rateWithPercent: number;
}

export interface BalanceTransaction {
    transactionId: number;
    paymentId: string;
    status: number;
    amount: number;
    date: string;
}