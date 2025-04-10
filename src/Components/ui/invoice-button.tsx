import { Button } from "@/Components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface InvoiceButtonProps {
    companyId: string;
    className?: string;
}

export function InvoiceButton({ companyId, className }: InvoiceButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreateInvoice = async () => {
        setIsLoading(true);
        try {
            router.push(`/Bills/Create`);
        } catch (error) {
            toast.error("Failed to create invoice. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCreateInvoice}
            disabled={isLoading}
            className={`relative group overflow-hidden ${className}`}
        >
            <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <PlusCircle className="h-4 w-4" />
                )}
                Create Invoice
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
    );
} 