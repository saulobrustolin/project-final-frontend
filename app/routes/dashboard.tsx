import { Card, CardTitle } from "~/components/ui/card";
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
            <Card>
              <CardTitle>Title</CardTitle>
            </Card>
        </div>
    );
}

export default Dashboard;