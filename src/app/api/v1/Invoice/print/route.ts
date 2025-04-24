// pages/api/print.js
import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";

export default async function handleServerPrint(req: Request, invoice: any) {
    try {
        // const { invoice } = await req.json();
        const printer = new ThermalPrinter({
            type: PrinterTypes.STAR,
            interface: "usb://0x0519:0x0001", // Replace with your printer’s USB interface
        });

        const isConnected = await printer.isPrinterConnected();
        if (!isConnected) {
            throw new Error("Printer not connected");
        }

        printer.alignCenter();
        printer.println(invoice.companyName);
        printer.println(invoice.companyAddress);
        printer.alignLeft();
        printer.println(`Invoice No: ${invoice.invoiceId}`);
        printer.println(`Date: ${new Date().toLocaleDateString()}`);
        printer.println("----------------------------------------");
        printer.tableCustom([
            { text: "Item", align: "LEFT", width: 0.5 },
            { text: "Qty", align: "RIGHT", width: 0.15 },
            { text: "Rate", align: "RIGHT", width: 0.15 },
            { text: "Total", align: "RIGHT", width: 0.2 },
        ]);
        invoice.products.forEach((item: any) => {
            printer.tableCustom([
                { text: item.name, align: "LEFT", width: 0.5 },
                { text: item.quantity.toString(), align: "RIGHT", width: 0.15 },
                { text: item.rate.toFixed(2), align: "RIGHT", width: 0.15 },
                { text: (item.quantity * item.rate).toFixed(2), align: "RIGHT", width: 0.2 },
            ]);
        });
        printer.println("----------------------------------------");
        printer.tableCustom([
            { text: "Subtotal:", align: "LEFT", width: 0.8 },
            { text: invoice.subTotal.toFixed(2), align: "RIGHT", width: 0.2 },
        ]);
        invoice.appliedTaxes.forEach((tax: any) => {
            printer.tableCustom([
                { text: `${tax.taxName} (${tax.percentage}%):`, align: "LEFT", width: 0.8 },
                { text: tax.amount.toFixed(2), align: "RIGHT", width: 0.2 },
            ]);
        });
        printer.tableCustom([
            { text: `Grand Total: ${invoice.grandTotal.toFixed(2)}`, align: "LEFT", width: 0 }
        ]);



    } catch (error) {
        console.log(error);

    }
}
