import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios";
import api from "~/lib/api";
import type { Resume } from "~/lib/types";
import type { UserData } from "~/schemas/userSchema";

const signup = async (data: UserData) => {
    const response: AxiosResponse<Resume> = await api.post("/auth/signup", data);

    return response.data;
}

export function useSignup() {
  return useMutation({
    mutationFn: signup
  });
}

export default useSignup;