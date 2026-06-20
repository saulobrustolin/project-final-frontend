import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "~/lib/api";
import type { TransactionData } from "~/schemas/transactionSchema";

const patchTransaction = async (data: TransactionData) => {
    await api.patch(`/transactions/${data.transactionId}`, data);
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });
}

export default useUpdateTransaction;