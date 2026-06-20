import { useMutation } from "@tanstack/react-query"
import api from "~/lib/api";

const sendCode = async () => {
    const response = await api.get("/users/send-code");

    return response.data;
}

export function sendCodeQuery() {
  return useMutation({
    mutationFn: sendCode
  });
}

export default sendCodeQuery;