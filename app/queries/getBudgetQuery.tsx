import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios";
import api from "~/lib/api";
import type { Budget } from "~/lib/types";

const getBudgets = async () => {
    const response: AxiosResponse<Budget[]> = await api.get("/budgets");

    return response.data;
}

const getBudgetsQuery = () => useQuery({ queryKey: ['budgets'], queryFn: () => getBudgets() });

export default getBudgetsQuery;