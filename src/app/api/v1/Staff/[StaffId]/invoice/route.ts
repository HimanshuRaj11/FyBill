import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ StaffId: string }> }) {
    try {
        const user_id = await verifyUser();
        const { StaffId } = await params;
        const { startDate, endDate } = await req.json();
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
        const invoices = await InvoiceModel.find({
            createdBy: StaffId, createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" }
        }).populate({
            path: 'branchId',
            model: branchModel
        }).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ invoices, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}