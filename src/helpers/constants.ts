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
    Transaction,
    Purchase,
    Withdrawal,
    Ordered,
    Sent,
    DepositTraders,
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

export enum CONFIGS {
    RubleRate = 'RUBLE_RATE',
}

export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export const DEFAULT_TRADER_TARIFFS = [
    { tariffId: 'sbp', title: 'СБП', limitMin: 0, limitMax: 300000, commissionPercent: 1, commissionAmount: 0 },
    { tariffId: 'sber', title: 'Сбербанк', limitMin: 0, limitMax: 300000, commissionPercent: 1, commissionAmount: 0 },
    { tariffId: 'other', title: 'Другие банки', limitMin: 0, limitMax: 300000, commissionPercent: 2.5, commissionAmount: 0 },
    {
        tariffId: 'transfer',
        title: 'Пополнение криптовалютой и оплата откупа',
        limitMin: 0,
        limitMax: 300000,
        commissionPercent: 2.5,
        commissionAmount: 0,
    },
];

export const DEFAULT_CASHBOX_TARIFFS = [
    {
        tariffId: 'p2p',
        title: 'CARD P2P (PAYMENT_METHOD: 1, CURRENCY: 1)',
        type: 'transaction',
        limitMin: 100,
        limitMax: 300000,
        commissionPercent: 9,
        commissionAmount: 0,
    },
    {
        tariffId: 'sbp_transaction',
        title: 'СБП (PAYMENT_METHOD: 2, CURRENCY: 1)',
        type: 'transaction',
        limitMin: 100,
        limitMax: 300000,
        commissionPercent: 9,
        commissionAmount: 0,
    },
    {
        tariffId: 'trc20',
        title: 'TRC-20 (PAYMENT_METHOD: 3, CURRENCY: 1)',
        type: 'transaction',
        limitMin: 100,
        limitMax: 300000,
        commissionPercent: 1.5,
        commissionAmount: 0,
    },
    {
        tariffId: 'usdt_trc20',
        title: 'USDT TRC-20 (PAYMENT_METHOD: 2, CURRENCY: 1)',
        type: 'purchase',
        limitMin: 5000,
        limitMax: 500000,
        commissionPercent: 4,
        commissionAmount: 250,
    },
    {
        id: 'bank',
        title: 'Банковская карта (PAYMENT_METHOD: 1, CURRENCY: 1)',
        type: 'purchase',
        limitMin: 500,
        limitMax: 300000,
        commissionPercent: 4,
        commissionAmount: 0,
    },
    {
        tariffId: 'sbp_purchase',
        title: 'СБП (PAYMENT_METHOD: 3, CURRENCY: 1)',
        type: 'purchase',
        limitMin: 1000,
        limitMax: 500000,
        commissionPercent: 4,
        commissionAmount: 0,
    },
    {
        tariffId: 'trx',
        title: 'TRX (PAYMENT_METHOD: 4, CURRENCY: 1)',
        type: 'purchase',
        limitMin: 100,
        limitMax: 1000000000,
        commissionPercent: 0,
        commissionAmount: 20,
    },
    {
        tariffId: 'piastrix',
        title: 'PIASTRIX (PAYMENT_METHOD: 5, CURRENCY: 1)',
        type: 'purchase',
        limitMin: 500,
        limitMax: 2000000,
        commissionPercent: 1,
        commissionAmount: 0,
    },
];