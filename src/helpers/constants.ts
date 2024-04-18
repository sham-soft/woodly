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

export enum PURCHASE_STATUSES {
    Available = 1,
    Active,
    Cancelled,
    Successful,
}