import { z } from "zod";

export const transactionSchema = z.object({
    transactionId: z.string().nullish(),
    description: z.string().nonempty("A descrição é obrigatória"),
    amount: z.number().positive("O preço precisa ser maior que 0"),
    subdivision: z.number().int("A parcela precisa ser um número inteiro").positive("A parcela precisa ser maior que 0").optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    collection: z.object({
        name: z.string().nonempty("É necessário escolher uma coleção"),
        icon: z.string()
    }),
    date: z.date()
});

export type TransactionData = z.infer<typeof transactionSchema>;