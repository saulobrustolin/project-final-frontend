import { z } from "zod";

export const budgetSchema = z.object({
    budgetId: z.string().nullish(),
    description: z.string().nonempty("A descrição é obrigatória"),
    target: z.number().positive("O objetivo precisa ser maior que 0"),
    balance: z.number().nonnegative("O balance não pode ser negativo"),
    createdAt: z.coerce.date().nullish()
});

export type BudgetData = z.infer<typeof budgetSchema>;