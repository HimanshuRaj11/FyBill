import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import BranchModel from "@/Model/branch.model";


export async function POST(request: Request) {

    try {
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
        const {
            clientName,
            phoneNumber,
            products,
            subTotal,
            appliedTaxes,
            totalTaxAmount,
            grandTotal,
            BillType,
            paymentMode,
            selectedBranch,
            InvoiceStatus,
            HoldedInvoice,
            discountValue,
            discountType,
            isExempted,
        } = await request.json();
        let invoice

        if (HoldedInvoice) {
            invoice = await InvoiceModel.findByIdAndUpdate({ _id: HoldedInvoice }, {
                clientName,
                clientPhone: phoneNumber,
                products,
                subTotal,
                appliedTaxes,
                totalTaxAmount,
                grandTotal,
                BillType,
                paymentMode,
                InvoiceStatus,
                isExempted,
                discountValue,
                discountType,
            }, { returnDocument: "after" })
            await invoice.save();
        }
        if (!HoldedInvoice) {
            let companyAddress = ''
            let lastInvoiceNo = 0;

            const Branch = await BranchModel.findOne({ _id: User.branchId || selectedBranch })
            if (Branch) {
                lastInvoiceNo = Branch.lastInvoiceNo + 1;
                companyAddress = Branch.address.street + " " + Branch.address.city + " " + Branch.address.state;
                Branch.lastInvoiceNo = Branch.lastInvoiceNo + 1;
                await Branch.save();
            } else {
                lastInvoiceNo = Company.lastInvoiceNo + 1;
                companyAddress = Company.address.street + " " + Company.address.city + " " + Company.address.state
                Company.lastInvoiceNo = Company.lastInvoiceNo + 1;
                await Company.save();
            }

            invoice = await InvoiceModel.create({
                invoiceId: lastInvoiceNo + 1,
                invoiceIdTrack: lastInvoiceNo + 1,
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
                BillType,
                grandTotal,
                paymentMode,
                InvoiceStatus,
                currency: Company.currency.symbol,
                createdBy: User._id,
                discountValue,
                discountType,
                isExempted,

            })
            if (User.branchId || selectedBranch) {
                invoice.branchId = Branch;
                invoice.branchName = Branch.branchName;
            }
            await invoice.save();
        }

        return Response.json({ message: "Invoice created successfully", invoice, success: true }, { status: 200 });

    } catch (error) {
        return Response.json({ message: "Internal server error", error }, { status: 500 });
    }

}