import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";
import type { BudgetData } from "~/schemas/budgetSchema";

const updateBudget = async (data: BudgetData) => {
    await api.patch(`/budgets/${data.budgetId}`, data);
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export default useUpdateBudget;