import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";
import type { TransactionData } from "~/schemas/transactionSchema";

const postTransaction = async (data: TransactionData) => {
    await api.post('/transactions', data);
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });
}

export default useCreateTransaction;