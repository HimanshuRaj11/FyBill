import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { generateInvoiceId } from "@/lib/generateInvoiceId";
import CompanyModel from "@/Model/Company.model";
import BranchModel from "@/Model/branch.model";
import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
export async function POST(request: Request) {

    try {
        const Unique_id = generateInvoiceId();

        const User_id = await verifyUser();
        if (!User_id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: User_id })
        if (!User) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        const Company = await CompanyModel.findById({ _id: User.companyId })
        if (!Company) {
            return Response.json({ message: "Company not found" }, { status: 404 });
        }
        const Branch = await BranchModel.findOne({ companyId: User.companyId })
        let companyAddress = ''
        if (Branch) {
            companyAddress = Branch.address.street + " " + Branch.address.city + " " + Branch.address.state + " " + Branch.address.country + " " + Branch.address.zipCode
        } else {
            companyAddress = Company.address.street + " " + Company.address.city + " " + Company.address.state + " " + Company.address.country + " " + Company.address.zipCode
        }
        const {
            clientName,
            phoneNumber,
            products,
            subTotal,
            appliedTaxes,
            totalTaxAmount,
            grandTotal,
            paymentMode,
            selectedBranch
        } = await request.json();


        const invoice = await InvoiceModel.create({
            invoiceId: Unique_id,
            companyId: Company._id,
            clientName,
            clientPhone: phoneNumber,
            companyName: Company.name,
            companyAddress,
            issueDate: new Date(),
            products,
            subTotal,
            appliedTaxes,
            totalTaxAmount,
            grandTotal,
            paymentMode,
            currency: Company.currency.symbol,
            createdBy: User._id
        })
        if (User.branchId || selectedBranch) {
            invoice.branchId = User.branchId || selectedBranch;
            const branch = await BranchModel.findById({ _id: User.branchId || selectedBranch })
            invoice.branchName = branch?.branchName || "";
        }
        await invoice.save();

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
        return Response.json({ message: "Invoice created successfully", invoice }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: "Internal server error", error }, { status: 500 });
    }

}