export enum CARD_STATUSES {
    Active = 1,
    Inactive,
    Deleted,
}

export enum TRANSACTION_STATUSES {
    Active = 1,
    Verification,
    Cancelled,
    Successful,
}

export enum BALANCE_STATUSES {
    Internal = 1,
    Deposit,
    Deduction,
    Freeze,
}