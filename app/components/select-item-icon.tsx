import { cn } from "~/lib/utils";
import { SelectItem } from "./ui/select"
import * as LucideIcons from "lucide-react"

interface ItemIconProps {
    name: string,
    icon: string,
    className?: string,
}

const SelectItemIcon = ({ name, icon, className }: ItemIconProps) => {
    const IconComponent = (LucideIcons as any)[icon];
    
    return (
        <SelectItem key={name} value={name}>
            <span className={cn(className, "rounded-full p-2 text-white data-[slot='select-value']:hidden")}>
                {<IconComponent />}
            </span>
            <p>
                {name}
            </p>
        </SelectItem>
    )
}

export default SelectItemIcon;