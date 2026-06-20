import { Outlet, useNavigate } from "react-router";
import { requireAuth } from "~/utils/auth.server";
import type { Route } from "./+types/layout-main";
import * as LucideIcons from "lucide-react";
import { Card } from "~/components/ui/card";
import { menus } from "~/lib/singleton";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await requireAuth(request);

    return {
        message: "Main layout",
        user
    };
};

const LayoutMain = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-cream min-screen py-4 flex flex-col items-center">
            <main className="xl:max-w-3/4 px-4 w-full">
                <Card className="flex flex-col gap-4 bg-transparent ring-0 p-0.5">
                    <Outlet />
                    <div className="fixed bottom-0 sm:bottom-1 left-1/2 -translate-1/2 flex gap-8 bg-green-high p-4 px-8 rounded-full">
                        {menus.map(m => {
                            const IconComponent = (LucideIcons as any)[m.icon];

                            return (
                                <span key={m.name} className="capitalize text-xs font-medium items-center gap-1 flex flex-col text-neutral-900 hover:scale-110 cursor-pointer hover:text-neutral-800" onClick={() => navigate(m.to)}>
                                    <IconComponent />
                                    {m.name}
                                </span>
                            )
                        })}
                    </div>
                </Card>
            </main>
        </div>
    )
}

export default LayoutMain;