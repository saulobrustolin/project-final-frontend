import { SelectItem } from "./ui/select"
import * as LucideIcons from "lucide-react"

interface ItemIconProps {
    name: string,
    icon: string
}

const SelectItemIcon = ({ name, icon }: ItemIconProps) => {
    const IconComponent = (LucideIcons as any)[icon];
    
    return (
        <SelectItem key={name} value={name}>
            <span className="bg-red-400 rounded-full p-2 text-white data-[slot='select-value']:hidden">
                {<IconComponent />}
            </span>
            <p>
                {name}
            </p>
        </SelectItem>
    )
}

export default SelectItemIcon;