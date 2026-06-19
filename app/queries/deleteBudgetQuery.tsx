import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";

const deleteBudget = async (id: string) => {
    await api.delete(`/budgets/${id}`);
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export default useDeleteBudget;