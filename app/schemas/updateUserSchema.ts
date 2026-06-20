import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.email().nonempty("O e-mail é obrigatório"),
    currentPassword: z.string().nonempty("A senha atual é obrigatória"),
    password: z.string().nonempty("A senha é obrigatória"),
    confirmPassword: z.string().nonempty("A senha de confirmação é obrigatória"),
    code: z.string().nonempty("O código de confirmação é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;