import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import KOTModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const user_id = await verifyUser();

        if (!user_id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: user_id });

        if (!User) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        const companyId = User.companyId;
        const company = await CompanyModel.findById({ _id: companyId });
        if (!company) {
            return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });
        }

        const { selectedBranch, startDate, endDate } = await request.json();
        let invoices;

        if (User?.role == 'Owner') {
            invoices = await InvoiceModel.find({
                companyId: companyId,
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                },
                ...(selectedBranch !== "All" && { branchName: selectedBranch }),
                InvoiceStatus: "Done",
                BillType: { $ne: "KOT" }
            }).populate({
                path: 'branchId',
                model: branchModel
            }).sort({ createdAt: -1 }).lean()
        } else {
            invoices = await InvoiceModel.find({
                createdBy: user_id, createdAt: {
                    $gte: startDate,
                    $lt: endDate
                },
                InvoiceStatus: "Done",
                BillType: { $ne: "KOT" }
            }).populate({
                path: 'branchId',
                model: branchModel
            }).sort({ createdAt: -1 }).lean()
        }
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