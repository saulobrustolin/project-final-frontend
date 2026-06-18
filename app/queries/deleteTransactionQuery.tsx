import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";

const deleteTransaction = async (id: string) => {
    await api.delete(`/transactions/${id}`);
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });
}

export default useDeleteTransaction;