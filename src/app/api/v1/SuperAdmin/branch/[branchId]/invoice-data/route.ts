import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import KOTModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";


export async function POST(request: Request, { params }: { params: Promise<{ branchId: string }> }) {

    try {
        const { branchId } = await params;

        const user_id = await verifyUser();
        if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const User = await UserModel.findById(user_id);
        if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        const { startDate, endDate } = await request.json();


        const invoiceFilter: any = {
            createdAt: { $gte: startDate, $lt: endDate },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
            branchId: branchId,
        };



        const invoices = await InvoiceModel.find(invoiceFilter)
            .select('_id grandTotal totalTaxAmount createdAt invoiceIdTrack currency clientName invoiceId ')
            .sort({ createdAt: -1 })
            .lean();

        // calculate totals
        const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);
        const totalTaxAmount = invoices.reduce((sum, inv) => sum + (Number(inv.totalTaxAmount) || 0), 0);
        const invoicesLength = invoices.length;
        const currency = invoicesLength > 0 ? invoices[0].currency : null;


        return NextResponse.json(
            { invoices, invoicesLength, totalRevenue, totalTaxAmount, currency, success: true },
            { status: 200 }
        );

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