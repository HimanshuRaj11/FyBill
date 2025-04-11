import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ InvoiceId: string }> }) {
    try {
        const user_id = await verifyUser();
        const { InvoiceId } = await params;


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
        const invoice = await InvoiceModel.findOne({ invoiceId: InvoiceId }).populate({
            path: "createdBy",
            select: "_id email name phone role"
        })

        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found", success: false }, { status: 404 });
        }
        if (invoice.companyId.toString() !== companyId.toString()) {
            return NextResponse.json({ message: "Invoice not found", success: false }, { status: 404 });
        }

        return NextResponse.json({ invoice, success: true }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}