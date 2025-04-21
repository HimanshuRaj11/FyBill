import { NextApiRequest, NextApiResponse } from "next";
import { ThermalPrinter, PrinterTypes, CharacterSet } from "node-thermal-printer";

interface Invoice {
    invoiceId: string;
    clientName: string;
    clientPhone: string;
    products: { name: string; rate: number; quantity: number; amount: number }[];
    subTotal: number;
    grandTotal: number;
    paymentMode: string;
    appliedTaxes: { taxName: string; percentage: number; amount: number }[];
    companyName?: string;
    companyAddress?: string;
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const invoice: Invoice = req.body;

    if (!invoice || !invoice.products?.length) {
        return res.status(400).json({ error: "Invalid invoice data" });
    }

    const printer = new ThermalPrinter({
        type: PrinterTypes.STAR, // Adjust to STAR or EPSON based on your printer
        interface: "usb", // Use "tcp://<printer-ip>:9100" for network printers
        // driver: import("@thiagoelg/node-printer"), // Optional, for advanced driver support
        characterSet: CharacterSet.SLOVENIA, // Adjust based on your printer's supported charset
        removeSpecialCharacters: false,
        lineCharacter: "-",
    });

    try {
        // Check if printer is connected
        const isConnected = await printer.isPrinterConnected();
        if (!isConnected) {
            throw new Error("Printer not connected");
        }

        // Format the receipt
        printer.alignCenter();
        printer.println(invoice.companyName || "Your Company");
        printer.println(invoice.companyAddress || "123 Main St");
        printer.println(`Invoice No: ${invoice.invoiceId}`);
        printer.println(`Date: ${new Date().toLocaleDateString()}`);
        printer.drawLine();

        printer.println("Bill To:");
        printer.println(invoice.clientName);
        printer.println(`Phone: ${invoice.clientPhone}`);
        printer.drawLine();

        printer.tableCustom([
            { text: "Item", align: "LEFT", width: 0.5 },
            { text: "Qty", align: "CENTER", width: 0.15 },
            { text: "Rate", align: "RIGHT", width: 0.2 },
            { text: "Total", align: "RIGHT", width: 0.2 },
        ]);
        printer.drawLine();

        invoice.products.forEach((item) => {
            printer.tableCustom([
                { text: item.name, align: "LEFT", width: 0.5 },
                { text: item.quantity.toString(), align: "CENTER", width: 0.15 },
                { text: item.rate.toFixed(2), align: "RIGHT", width: 0.2 },
                { text: (item.quantity * item.rate).toFixed(2), align: "RIGHT", width: 0.2 },
            ]);
        });

        printer.drawLine();
        printer.tableCustom([
            { text: "Subtotal:", align: "LEFT", width: 0.8 },
            { text: invoice.subTotal.toFixed(2), align: "RIGHT", width: 0.2 },
        ]);

        invoice.appliedTaxes.forEach((tax) => {
            printer.tableCustom([
                { text: `${tax.taxName} (${tax.percentage}%):`, align: "LEFT", width: 0.8 },
                { text: tax.amount.toFixed(2), align: "RIGHT", width: 0.2 },
            ]);
        });

        const totalTax = invoice.appliedTaxes.reduce((sum, tax) => sum + tax.amount, 0);
        printer.tableCustom([
            { text: "Total Tax:", align: "LEFT", width: 0.8 },
            { text: totalTax.toFixed(2), align: "RIGHT", width: 0.2 },
        ]);

        printer.drawLine();
        printer.tableCustom([
            { text: "Grand Total:", align: "LEFT", width: 0.8, bold: true },
            { text: invoice.grandTotal.toFixed(2), align: "RIGHT", width: 0.2, bold: true },
        ]);

        printer.tableCustom([
            { text: "Payment:", align: "LEFT", width: 0.8 },
            { text: invoice.paymentMode, align: "RIGHT", width: 0.2 },
        ]);

        printer.drawLine();
        printer.alignCenter();
        printer.println("Thank You!");
        printer.newLine();
        printer.cut();

        // Execute the print
        await printer.execute();
        printer.clear();

        return res.status(200).json({ message: "Bill printed successfully" });
    } catch (error: any) {
        console.error("Printing failed:", error);
        return res.status(500).json({ error: `Failed to print bill: ${error.message}` });
    }
}