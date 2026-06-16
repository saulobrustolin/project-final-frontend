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
        <div className="bg-cream min-screen py-4 flex flex-col items-center">
            <main className="md:max-w-2/3 px-4 w-full">
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutMain;