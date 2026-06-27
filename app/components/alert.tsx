import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { LoaderCircle } from "lucide-react";

interface AlertProps {
    isOpen: boolean;
    setIsOpen: () => void;
    title: string;
    description: string;
    onAccept: () => void;
    loading: boolean;
}

const Alert = ({ isOpen, setIsOpen, title, description, onAccept, loading }: AlertProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onAccept}
                        disabled={loading}
                    >
                        {loading ? <LoaderCircle className="animate-spin" /> : "Confirmar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Alert;