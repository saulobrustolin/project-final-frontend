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
    onAction?: () => void;
    onOpenChange?: (x: boolean) => void;
    open?: boolean;
}

const ButtonDrawer = ({ children, title, className, titleClose, open, onOpenChange, onAction }: DialogCreateIncomeProps) => {
    return (
        <Drawer direction="bottom" open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild onClick={onAction}>
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