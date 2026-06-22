import { cn } from "~/lib/utils"
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
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { loginSchema, type LoginData } from "~/schemas/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import useSignin from "~/queries/signinQuery"
import { LoaderCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const signin = useSignin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitLogin = (data: LoginData) => {
    signin.mutate(data, {
      onSuccess: () => {
        toast.success("Usuário autenticado com sucesso");
        navigate("/");
      },
      onError: error => {
        const r = error.response?.data;
        if (r?.message) {
          setError("password", {
            type: "server",
            message: r.message
          });
          setError("email", {
            type: "server",
            message: undefined
          });
        } else {
          toast.error("O servidor está em manutenção no momento, tente novamente mais tarde...");
        }
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Acessar sua conta</CardTitle>
          <CardDescription>
            Coloque o seu e-mail abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="POST" onSubmit={handleSubmit(submitLogin)}>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  aria-invalid={!!errors.email}
                  id="email"
                  type="email"
                  placeholder="Digite o seu e-mail"
                  required
                  {...register("email")}
                />
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    tabIndex={-1}
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
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
              <Field>
                <Button type="submit" className={"bg-green-high"} disabled={signin.isPending}>
                  {signin.isPending ? <LoaderCircle className="animate-spin" /> : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  Ainda não possui conta? <a href="/signup" className="text-green-high">Registrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
