import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import moment from "moment";

import KOTModel from "@/Model/KOT.model";


export async function POST(request: Request) {
    try {
        const user_id = await verifyUser();
        const SearchQuery = await request.json();

        if (!user_id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: user_id });

        if (!User) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        const branchId = User.branchId;
        const companyId = User.companyId;
        const company = await CompanyModel.findById({ _id: companyId });
        if (!company) {
            return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });
        }

        const searchRegex = new RegExp(SearchQuery.query, 'i'); // case-insensitive search

        const invoiceFilter: any = {
            companyId,
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            // delete: { $ne: true },
            $or: [
                { invoiceIdTrack: searchRegex },
                { clientName: searchRegex }
            ]
        };
        if (User?.role != 'Owner') {
            invoiceFilter.branchId = branchId
        }

        let invoices = await InvoiceModel.find(invoiceFilter).sort({ createdAt: -1 }).lean()

        invoices = await InvoiceKot(invoices);

        return NextResponse.json({ invoices, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}


// find NUMBER of KOTs of Invoices

const InvoiceKot = async (invoices: any[]) => {
    if (!invoices || invoices.length === 0) return invoices;

    const updatedInvoices = await Promise.all(
        invoices.map(async (inv) => {
            const kotCount = await KOTModel.find({ invoiceMongoId: inv._id }).countDocuments();
            return { ...inv, kotCount };
        })
    );

    return updatedInvoices;
}