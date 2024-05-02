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