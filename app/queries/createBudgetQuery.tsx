import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";
import type { BudgetData } from "~/schemas/budgetSchema";

const postBudget = async (data: BudgetData) => {
    await api.post('/budgets', data);
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export default useCreateBudget;