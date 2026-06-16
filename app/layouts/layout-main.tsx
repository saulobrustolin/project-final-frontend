import { Outlet } from "react-router";
import { requireAuth } from "~/utils/auth.server";
import type { Route } from "./+types/layout-main";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await requireAuth(request);

    return {
        message: "Main layout",
        user
    };
};

const LayoutMain = () => {
    return (
        <div className="bg-cream min-screen p-2 md:max-w-4/5 lg:max-w-2/3">
            <Outlet />
        </div>
    )
}

export default LayoutMain;