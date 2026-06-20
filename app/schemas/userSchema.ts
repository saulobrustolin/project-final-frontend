import { z } from "zod";

export const usersSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.email().nonempty("O e-mail é obrigatório"),
    cpf: z.string().nonempty("O CPF é obrigatório"),
    password: z.string().nonempty("A senha é obrigatória"),
    confirmPassword: z.string().nonempty("A senha de confirmação é obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type UserData = z.infer<typeof usersSchema>;