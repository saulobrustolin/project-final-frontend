import { useMutation } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios";
import api from "~/lib/api";
import type { ErrorMessage, Resume } from "~/lib/types";
import type { LoginData } from "~/schemas/loginSchema";

const signin = async (data: LoginData) => {
    const response: AxiosResponse<Resume> = await api.post("/auth/signin", data);

    return response.data;
}

export function useSignin() {
  return useMutation<Resume, AxiosError<ErrorMessage>, LoginData>({
    mutationFn: signin,
  });
}

export default useSignin;