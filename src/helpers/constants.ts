export enum CARD_STATUSES {
    Active = 1,
    Inactive,
    Deleted,
}

export enum TRANSACTION_STATUSES {
    Created = 1,
    Active,
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

export enum CASHBOX_STATUSES {
    Active = 1,
    Inactive,
}

export enum PAYMENT_SYSTEMS {
    Card = 1,
    SBP,
}

export enum CURRENCIES {
    Rub = 'rub',
    Kzt = 'kzt',
}

export enum BANK_TYPES {
    Sber = 1,
    Tinkoff,
    Rayfayzen,
}

export enum PROCESS_METHODS {
    Sms = 1,
    Gate,
    Api,
    Lk,
}

export enum SIM_SLOTS {
    Sim1 = 1,
    Sim2,
}

export enum COMISSION_PAYERS {
    Shop = 1,
    Recipient,
}

export enum ROLES {
    Admin = 'admin',
    Operator = 'operator',
    Trader = 'trader',
    Merchant = 'merchant',
}

export enum PERMISSIONS {
    Cards = 'cards',
    Cashboxes = 'cashboxes',
    Purchases = 'purchases',
    Transactions = 'transactions',
    Users = 'users',
    Statistics = 'statistics',
    Balance = 'balance',
    Settings = 'settings',
}

export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};