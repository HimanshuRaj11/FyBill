import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import KOTModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import moment from "moment";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        // const user_id = await verifyUser();
        // if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        // const User = await UserModel.findById(user_id);
        // if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        // const companyId = User.companyId;
        // const company = await CompanyModel.findById(companyId);
        // if (!company) return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });

        // const { selectedBranch, startDate, endDate } = await request.json();
        const startDate = moment().startOf('month').toDate();
        const endDate = moment().endOf('month').toDate();
        const invoiceFilter: any = {
            // companyId: companyId,
            createdAt: { $gte: startDate, $lt: endDate },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
        };

        // if (User.role === "Owner") {
        //     if (selectedBranch !== "All") invoiceFilter.branchName = selectedBranch;
        // } else {
        //     invoiceFilter.createdBy = user_id;
        // }

        let invoices = await InvoiceModel.find(invoiceFilter)
            .populate({ path: "branchId", model: branchModel })
            .sort({ createdAt: -1 })
            .lean();

        invoices = await InvoiceKot(invoices);


        return NextResponse.json(
            { invoices, success: true },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}


// find NUMBER of KOTs of Invoices

const InvoiceKot = async (invoices: any[]) => {
    if (!invoices || invoices.length === 0) return invoices;
    let InvalidInvoices: any = [];

    await Promise.all(
        invoices.map(async (inv) => {
            const kots = await KOTModel.find({ invoiceMongoId: inv._id })
            if (!inv) {
                throw new Error("Invoice not found");
            }

            const invoiceGrandTotal = Number(inv.grandTotal);

            // check if ANY kot grandTotal is greater
            const invalidKotExists = kots.some(kot =>
                Number(kot.grandTotal) > invoiceGrandTotal

            );
            if (invalidKotExists) {
                const InvalidInvoice = { ...inv, kots };
                InvalidInvoices.push(InvalidInvoice);
            }

        })
    );

    return InvalidInvoices;
}
