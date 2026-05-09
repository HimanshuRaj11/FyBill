"use client";
import { Receipt } from "lucide-react";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/Components/ui/button";
import PrintInvoiceFormate from "@/Components/Main/PrintInvoiceFormate";

interface InvoiceDialogProps {
    showInvoice: boolean;
    setShowInvoice: (v: boolean) => void;
    invoice: any;
    invoiceRef: React.RefObject<HTMLDivElement>;
    handlePrintDocument: (e: React.MouseEvent) => void;
}

export default function InvoiceDialog({
    showInvoice,
    setShowInvoice,
    invoice,
    invoiceRef,
    handlePrintDocument,
}: InvoiceDialogProps) {
    if (!showInvoice || !invoice) return null;

    return (
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
            <DialogContent className="max-w-4xl w-full">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Receipt className="h-6 w-6" /> Invoice #{invoice.invoiceId}
                </DialogTitle>
                <div
                    ref={invoiceRef}
                    className="max-h-[70vh] overflow-auto p-4 border rounded-lg bg-white"
                >
                    <PrintInvoiceFormate invoice={invoice} />
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handlePrintDocument} className="px-8" size="lg">
                        Print Invoice
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}