import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useMask } from '@react-input/mask';
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersSchema, type UserData } from "~/schemas/userSchema";
import { useSignup } from "~/queries/signupQuery";
import { LoaderCircle } from "lucide-react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const signup = useSignup();
  const navigate = useNavigate();
  const cpfRef = useMask({
    mask: '___.___.___-__',
    replacement: { _: /\d/ },
  });

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: ''
    }
  });

  const submitRegister = async (data: UserData) => {
    await signup.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Usuário registrado com sucesso");
        navigate("/");
      },
      onError: response => {
        const r = response.response?.data;
        if (Array.isArray(r) && r.length) {
          const first = r[0];

          setError(first.field as "form" | "name" | "email" | "cpf" | "password" | "confirmPassword" | `root.${string}` | "root" | `form.${string}`, {
            type: "server",
            message: first.message
          });
        } else {
          toast.error(response.message ?? "O servidor está em manutenção, tente novamente mais tarde...");
        }
      }
    });
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Criar sua conta</CardTitle>
        <CardDescription>
          Adicione suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submitRegister)}>
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
            <Field data-invalid={!!errors.cpf}>
              <FieldLabel htmlFor="cpf">CPF</FieldLabel>
              <Input
                aria-invalid={!!errors.cpf}
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                required
                {...register("cpf")}
                ref={(e) => {
                  register("cpf").ref(e);
                  if (e) {
                    cpfRef.current = e;
                  }
                }}
              />
              <FieldError>
                {errors.cpf && <p className="text-destructive">{errors.cpf.message}</p>}
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
            <FieldGroup>
              <Field>
                <Button id="submit" className={"bg-green-high"} type="submit" disabled={signup.isPending}>
                  {signup.isPending ? <LoaderCircle className="animate-sping" /> : "Criar conta"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Já possui conta? <a href="/signin" className="text-green-high">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
