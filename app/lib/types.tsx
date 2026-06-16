export interface ErrorMessage {
    message: string
}

export interface CollectionType {
    name: string,
    icon: string
}

export interface Transaction {
    transactionId: string,
    description: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    collection: CollectionType,
    date: Date
}

export interface Budget {
    budgetId: string,
    description: string,
    target: number,
    createdAt: Date
}

export interface Resume {
    balance: number,
    net_balance: number,
    credit: number,
    debit: number,
    transactions: Transaction[],
    budgets: Budget[]
}