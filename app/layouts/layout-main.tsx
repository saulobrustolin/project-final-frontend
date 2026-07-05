import { Outlet, useNavigate } from "react-router";
import { requireAuth } from "~/utils/auth.server";
import type { Route } from "./+types/layout-main";
import * as LucideIcons from "lucide-react";
import { Card } from "~/components/ui/card";
import { menus } from "~/lib/singleton";
import { useEffect, useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await requireAuth(request);

    return {
        message: "Main layout",
        user
    };
};

const LayoutMain = () => {
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    return (
        <div className="bg-cream min-screen py-4 flex flex-col items-center">
            <main className="xl:max-w-3/4 px-4 w-full">
                <Card className="flex flex-col gap-4 bg-transparent ring-0 p-0.5">
                    <Outlet />
                    <div className={`fixed bottom-2 sm:bottom-1 left-1/2 -translate-x-1/2 flex gap-8 bg-green-high p-4 px-8 rounded-full transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-24'}`}>
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