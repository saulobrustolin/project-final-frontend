import { LoginForm } from "~/components/login-form"
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Route } from "./+types/signin";

export async function loader({ request }: Route.LoaderArgs) {
  return { message: "Sign-in page" };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "caixinha | entrar" },
    { name: "description", content: "Página de entrada do seu sistema de controle financeiro." },
  ];
}

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.info("Sessão expirada, faça login novamente.");

      searchParams.delete("expired");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-cream">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
