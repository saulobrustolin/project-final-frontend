import { SignupForm } from "~/components/signup-form"
import type { Route } from "./+types/signup";

export async function loader({ request }: Route.LoaderArgs) {
  return { message: "Sign-up page" };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "caixinha | registrar" },
    { name: "description", content: "Página de registro do seu sistema de controle financeiro." },
  ];
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-cream">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
