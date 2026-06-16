export interface ErrorMessage {
    message: string
}

export interface CollectionType {
    name: string,
    icon: string
}

export interface TransactionItem {
    description: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    collection: CollectionType,
    date: Date
}