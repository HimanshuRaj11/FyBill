import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import { AlwaysNotDeleteInvoiceByName } from "@/data/InvoiceData";

export async function POST(request: Request) {

    try {

        const user_id = await verifyUser();
        if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const User = await UserModel.findById(user_id);
        if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        const companyId = User.companyId;
        const company = await CompanyModel.findById(companyId);
        if (!company) return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });

        await InvoiceModel.updateMany(
            {
                $or: [
                    { important: { $ne: true } },
                    { clientName: { $in: AlwaysNotDeleteInvoiceByName } }
                ]
            },
            { $set: { "important": true } }
        )

        return NextResponse.json({ message: "Invoices Deleted SuccessFul", success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
