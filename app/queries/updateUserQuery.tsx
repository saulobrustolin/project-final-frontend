import { useMutation } from "@tanstack/react-query"
import api from "~/lib/api";
import type { UpdateUserData } from "~/schemas/updateUserSchema";
import type { UserData } from "~/schemas/userSchema";

const patchUser = async (data: UpdateUserData) => {
    await api.patch('/users', data);
}

export function updateUserQuery() {
  return useMutation({
    mutationFn: patchUser,
  });
}

export default updateUserQuery;