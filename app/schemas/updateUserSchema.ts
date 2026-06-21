import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().nullish(),
    email: z.email().optional().or(z.literal("").transform(() => undefined)),
    currentPassword: z.string().nonempty("A senha atual é obrigatória"),
    password: z.string().optional().or(z.literal("").transform(() => undefined)),
    confirmPassword: z.string().optional().or(z.literal("").transform(() => undefined)),
    code: z.string().nonempty("O código de confirmação é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
}).transform((data) => {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
    );
});;

export type UpdateUserData = z.infer<typeof updateUserSchema>;