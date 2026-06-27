import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";

type DeleteTransactionArgs = {
  id: string;
  type: "NEXT" | "ALL";
};

const deleteTransaction = async ({ id, type }: DeleteTransactionArgs) => {
    await api.delete(`/transactions/${id}`, {
      params: {
        type
      }
    });
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