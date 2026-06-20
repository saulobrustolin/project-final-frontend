import { z } from "zod";

export const loginSchema = z.object({
    email: z.email().nonempty("O e-mail é obrigatório"),
    password: z.string().nonempty("A senha é obrigatória"),
});

export type LoginData = z.infer<typeof loginSchema>;