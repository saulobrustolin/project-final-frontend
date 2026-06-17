import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from "./ui/drawer";
import { cn } from "~/lib/utils";

interface DialogCreateIncomeProps {
    children: ReactNode;
    title: {
        name: string;
        icon?: ReactNode;
    },
    titleClose: string;
    className?: string;
    onAction?: () => void
}

const ButtonDrawer = ({ children, title, className, titleClose }: DialogCreateIncomeProps) => {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button className={cn("", className)} variant="outline">
                    {title.icon ? title.icon : null}
                    {title.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                {children}
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">{titleClose}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default ButtonDrawer;