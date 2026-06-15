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
import { useState, type SyntheticEvent } from "react";
import { useMask } from '@react-input/mask';
import api from "~/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface Register {
  name: string,
  email: string,
  cpf: string,
  password: string,
  confirmPassword: string
}

interface FieldError {
  field: string,
  message: string
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const cpfRef = useMask({
    mask: '___.___.___-__',
    replacement: { _: /\d/ },
  });

  const [errors, setErrors] = useState<FieldError[]>([]);
  const [form, setForm] = useState<Register>({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: ""
  });

  const submitRegister = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password != form.confirmPassword) return setErrors([
      { field: "password", message: "A senha precisa ser igual a de confirmação" },
      { field: "confirmPassword", message: "" },
    ]);
    setErrors([]);

    await api.post("/auth/signup", form, {
      withCredentials: true
    })
      .then(() => {
        toast.success("Cadastro realizado com sucesso");

        navigate("/");
      })
      .catch(error => setErrors(error.response.data ?? []));
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
        <form onSubmit={submitRegister}>
          <FieldGroup>
            <Field data-invalid={errors.some(error => error.field == "name")}>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <Input
                aria-invalid={errors.some(error => error.field == "name")}
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                required
                value={form.name}
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
              />
              {errors.some(error => error.field == "name") ? (
                <FieldDescription>
                  {errors.filter(error => error.field == "name").map(error => {
                    return (
                      <p className="text-[var(--destructive)]" key={error.message}>{error.message}</p>
                    )
                  })}
                </FieldDescription>
              ) : null}
            </Field>
            <Field data-invalid={errors.some(error => error.field == "email")}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                aria-invalid={errors.some(error => error.field == "email")}
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                required
                value={form.email}
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
              />
              <FieldDescription>
                {errors.some(error => error.field == "email") ? errors.filter(error => error.field == "email").map(error => {
                  return (
                    <p className="text-[var(--destructive)]" key={error.message}>{error.message}</p>
                  )
                }) : "Nós iremos utilizar seu e-mail para confirmar o registro da sua conta"}
              </FieldDescription>
            </Field>
            <Field data-invalid={errors.some(error => error.field == "cpf")}>
              <FieldLabel htmlFor="cpf">CPF</FieldLabel>
              <Input
                ref={cpfRef}
                aria-invalid={errors.some(error => error.field == "cpf")}
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                required
                value={form.cpf}
                onChange={(e) => setForm(v => ({ ...v, cpf: e.target.value }))}
              />
              <FieldDescription>
                {errors.some(error => error.field == "cpf") ? errors.filter(error => error.field == "cpf").map(error => {
                  return (
                    <p className="text-[var(--destructive)]" key={error.message}>{error.message}</p>
                  )
                }) : "Nós iremos utilizar seu e-mail para confirmar o registro da sua conta"}
              </FieldDescription>
            </Field>
            <Field data-invalid={errors.some(error => error.field == "password")}>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                aria-invalid={errors.some(error => error.field == "password")}
                id="password"
                type="password"
                required
                placeholder="Digite a sua senha"
                value={form.password}
                onChange={e => setForm(v => ({ ...v, password: e.target.value }))}
              />
              <FieldDescription>
                {errors.some(error => error.field == "password") ? (
                  errors.filter(error => error.field == "password").map(error => {
                    return (
                      <p className="text-[var(--destructive)]" key={error.message}>{error.message}</p>
                    )
                  })
                ) : "Precisa ter no mínimo 8 caracteres"}
              </FieldDescription>
            </Field>
            <Field data-invalid={errors.some(error => error.field == "confirmPassword")}>
              <FieldLabel htmlFor="confirm-password">
                Confirmar senha
              </FieldLabel>
              <Input
                aria-invalid={errors.some(error => error.field == "confirmPassword")}
                id="confirm-password"
                type="password"
                required
                placeholder="Digite a sua confirmação de senha"
                value={form.confirmPassword}
                onChange={e => setForm(v => ({ ...v, confirmPassword: e.target.value }))}
              />
              <FieldDescription>
                {errors.some(error => error.field == "confirmPassword") ? (
                  errors.filter(error => error.field == "confirmPassword").map(error => {
                    return (
                      <p className="text-[var(--destructive)]" key={error.message}>{error.message}</p>
                    )
                  })
                ) : "Por favor, confirme a sua senha."}
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button className={"bg-green-high"} type="submit">Criar conta</Button>
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
