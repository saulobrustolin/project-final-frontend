import { z } from "zod";

export const transactionSchema = z.object({
    transactionId: z.string().nullish(),
    description: z.string().nonempty("A descrição é obrigatória"),
    amount: z.number().positive(),
    subdivision: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    collection: z.object({
        name: z.string().nonempty("É necessário escolher uma coleção"),
        icon: z.string()
    }),
    date: z.date()
});

export type TransactionData = z.infer<typeof transactionSchema>;