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
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useState, type SyntheticEvent } from "react"
import api from "~/lib/api"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import type { ErrorMessage } from "~/lib/types"
import { useNavigate } from "react-router"

interface Login {
  email: string,
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [invalidForm, setInvalidForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<Login>({
    email: "",
    password: ""
  });
  
  const submitLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    await api.post("/auth/signin", form, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        toast.success("Acesso concedido com sucesso");

        navigate("/");
      })
      .catch((error: AxiosError<ErrorMessage>) => {
        if (error.response?.status === 500) return toast.error("O servidor está em manutenção, tente novamente mais tarde...");

        setInvalidForm(true);
        return toast.error(error.response?.data?.message || "E-mail ou senha incorreta");
      })
      .finally(() => setIsSubmitting(false));
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
          <form onSubmit={submitLogin}>
            <FieldGroup>
              <Field data-invalid={invalidForm}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  aria-invalid={invalidForm}
                  id="email"
                  type="email"
                  placeholder="Digite o seu e-mail"
                  required
                  value={form.email}
                  onChange={e => {
                    setForm(v => ({ ...v, email: e.target.value }));
                    setInvalidForm(false);
                  }}
                />
              </Field>
              <Field data-invalid={invalidForm}>
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
                  aria-invalid={invalidForm}
                  id="password"
                  type="password"
                  required
                  placeholder="Digite a sua senha"
                  value={form.password}
                  onChange={e => {
                    setForm(v => ({ ...v, password: e.target.value }));
                    setInvalidForm(false);
                  }}
                />
              </Field>
              <Field>
                <Button className={"bg-green-high"} type="submit" disabled={isSubmitting}>Entrar</Button>
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
