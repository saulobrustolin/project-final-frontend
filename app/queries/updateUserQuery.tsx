import { useMutation } from "@tanstack/react-query"
import type { AxiosError, AxiosResponse } from "axios";
import api from "~/lib/api";
import type { ErrorField } from "~/lib/types";
import type { UpdateUserData } from "~/schemas/updateUserSchema";

const patchUser = async (data: UpdateUserData) => {
    await api.patch(`/users`, data);
}

export function updateUserQuery() {
  return useMutation<void, AxiosError<ErrorField[]>, UpdateUserData>({
    mutationFn: patchUser,
  });
}

export default updateUserQuery;