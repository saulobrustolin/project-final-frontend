export interface ErrorMessage {
    message: string
}

export interface ErrorField {
  field: string,
  message: string
}

export interface Transaction {
    transactionId: string,
    description: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    collection: string,
    date: Date
}

export interface TransactionForm extends Omit<Transaction, 'transactionId'> {
    transactionId?: string | undefined
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