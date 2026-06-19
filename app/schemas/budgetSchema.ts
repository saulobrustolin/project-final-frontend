import { z } from "zod";

export const budgetSchema = z.object({
    budgetId: z.string().nullish(),
    description: z.string().nonempty("A descrição é obrigatória"),
    target: z.number().positive(),
    balance: z.number(),
    createdAt: z.coerce.date()
});

export type BudgetData = z.infer<typeof budgetSchema>;