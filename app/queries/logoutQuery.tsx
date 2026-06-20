import { useMutation } from "@tanstack/react-query"
import api from "~/lib/api";

const logout = async () => {
    const response = await api.get("/auth/logout");

    return response.data;
}

export function useLogout() {
  return useMutation({
    mutationFn: logout
  });
}

export default useLogout;