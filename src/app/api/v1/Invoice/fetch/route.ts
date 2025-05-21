import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import moment from "moment";
const today = moment().startOf('day').toDate();
const tomorrow = moment().startOf('day').add(1, 'day').toDate();

export async function GET() {
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
        let invoices;

        if (User?.role == 'Owner') {
            invoices = await InvoiceModel.find({
                companyId: companyId,
                createdAt: {
                    $gte: today,
                    $lt: tomorrow
                },
                InvoiceStatus: "Done",
                BillType: { $ne: "KOT" }
            }).populate({
                path: 'branchId',
                model: branchModel
            }).sort({ createdAt: -1 }).lean();
        } else {
            invoices = await InvoiceModel.find({
                createdBy: user_id, createdAt: {
                    $gte: today,
                    $lt: tomorrow
                },
                InvoiceStatus: "Done",
                BillType: { $ne: "KOT" }
            }).populate({
                path: 'branchId',
                model: branchModel
            }).sort({ createdAt: -1 }).lean()
        }

        return NextResponse.json({ invoices, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}