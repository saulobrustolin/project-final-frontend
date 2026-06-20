import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosResponse } from "axios";
import api from "~/lib/api";
import type { Resume } from "~/lib/types";
import type { LoginData } from "~/schemas/loginSchema";

const signin = async (data: LoginData) => {
    const response: AxiosResponse<Resume> = await api.post("/auth/signin", data);

    return response.data;
}

export function useSignin() {
  return useMutation({
    mutationFn: signin
  });
}

export default useSignin;