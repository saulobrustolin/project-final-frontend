import { redirect } from "react-router";
import type { Route } from "./+types/NotFound";

export async function loader({ request }: Route.LoaderArgs) {
    throw redirect("/");
}

const NotFoundPage = () => {
    return (
        <div className="bg-cream min-screen">
            Essa página não existe, redirecionando para página inicial...
        </div>
    )
}

export default NotFoundPage;