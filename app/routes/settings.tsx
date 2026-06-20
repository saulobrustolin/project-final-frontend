import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/budgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import updateUserQuery from "~/queries/updateUserQuery";
import { updateUserSchema, type UpdateUserData } from "~/schemas/updateUserSchema";
import useLogout from "~/queries/logoutQuery";
import { useForm } from "react-hook-form";
import { DoorOpen, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import sendCodeQuery from "~/queries/sendCodeQuery";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "caixinha | settings" },
        { name: "description", content: "Bem-vindo a página de configurações do seu sistema de controle financeiro." },
    ];
}

const Budgets = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const userUpdate = updateUserQuery();
    const sendCode = sendCodeQuery();

    const [codeSubmitted, setCodeSubmitted] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: '',
            email: '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
            code: ''
        }
    });

    const submitUpdate = async (data: UpdateUserData) => {
        await userUpdate.mutateAsync(data, {
            onSuccess: () => {
                toast.success("O usuário foi atualizado com sucesso");
                reset({
                    name: '',
                    email: '',
                    currentPassword: '',
                    password: '',
                    confirmPassword: '',
                    code: ''
                });
            },
            onError: response => {
                toast.error(response.message ?? "O servidor está em manutenção, tente novamente mais tarde...");
            }
        })
    }

    const submitLogout = async () => {
        await logout.mutate();

        navigate("/signin");
    }

    const submitCode = async () => {
        await sendCode.mutate();

        setCodeSubmitted(true);
        setInterval(() => {
            setCodeSubmitted(false);
        }, 1200000)
    }

    return (
        <>
            <Button className="flex gap-1 bg-red-400 w-fit" onClick={submitLogout}>
                <DoorOpen />
                sair desta conta.
            </Button>
            <Card className="flex flex-col gap-4 ring-0">
                <CardHeader>
                    <CardTitle>Configurações</CardTitle>
                    <CardDescription>
                        Aqui tem todos os seus dados de perfil, caso queira atualizar fique a vontade
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submitUpdate)}>
                        <FieldGroup>
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                                <Input
                                    aria-invalid={!!errors.name}
                                    id="name"
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    required
                                    {...register("name")}
                                />

                                <FieldError>
                                    {errors.name && <p className="text-destructive">{errors.name.message}</p>}
                                </FieldError>
                            </Field>
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                <Input
                                    aria-invalid={!!errors.email}
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    required
                                    {...register("email")}
                                />
                                <FieldError>
                                    {errors.email && <p className="text-destructive">{errors.email.message}</p>}
                                </FieldError>
                            </Field>
                            <Field data-invalid={!!errors.password}>
                                <FieldLabel htmlFor="password">Senha</FieldLabel>
                                <Input
                                    aria-invalid={!!errors.password}
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="Digite a sua senha"
                                    {...register("password")}
                                />
                                <FieldError>
                                    {errors.password && <p className="text-destructive">{errors.password.message}</p>}
                                </FieldError>
                            </Field>
                            <Field data-invalid={!!errors.confirmPassword}>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirmar senha
                                </FieldLabel>
                                <Input
                                    aria-invalid={!!errors.confirmPassword}
                                    id="confirm-password"
                                    type="password"
                                    required
                                    placeholder="Digite a sua confirmação de senha"
                                    {...register("confirmPassword")}
                                />
                                <FieldError>
                                    {errors.confirmPassword && <p className="text-destructive">{errors.confirmPassword.message}</p>}
                                </FieldError>
                            </Field>
                            <Field data-invalid={!!errors.code}>
                                <FieldLabel htmlFor="confirm-password">
                                    Código de confirmação
                                </FieldLabel>
                                <div className="flex gap-1">
                                    <Input
                                        aria-invalid={!!errors.code}
                                        id="code"
                                        type="text"
                                        required
                                        placeholder="Digite o seu código de confirmação"
                                        {...register("code")}
                                    />
                                    <Button
                                        className="px-2"
                                        onClick={submitCode}
                                        type="button"
                                    >
                                        Enviar código
                                    </Button>
                                </div>
                                {codeSubmitted ? (
                                    <FieldDescription>
                                        Solicitação de código enviada, entre 1 à 5 minutos chegará em seu e-mail.
                                    </FieldDescription>
                                ) : null}
                                <FieldError>
                                    {errors.code && <p className="text-destructive">{errors.code.message}</p>}
                                </FieldError>
                            </Field>
                            <FieldGroup>
                                <Field>
                                    <Button type="submit" className={"bg-green-high"} disabled={userUpdate.isPending}>
                                        {userUpdate.isPending ? <LoaderCircle className="animate-sping" /> : "Atualizar"}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default Budgets;