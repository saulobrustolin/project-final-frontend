import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "caixinha | página inicial" },
    { name: "description", content: "Bem-vindo a página inicial do seu sistema de controle financeiro." },
  ];
}

const Dashboard = () => {
    return (
        <div>
            -- dashboard --
        </div>
    );
}

export default Dashboard;