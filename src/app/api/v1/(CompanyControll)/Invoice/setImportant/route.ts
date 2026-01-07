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
        if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const User = await UserModel.findById(user_id);
        if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        const companyId = User.companyId;
        const company = await CompanyModel.findById(companyId);
        if (!company) return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });


        const { data } = await request.json()

        const uInvoice = await InvoiceModel.updateMany(
            { _id: { $in: data.invoiceIds } },
            { $set: { important: true, delete: false } }, { returnDocument: 'after' }
        )


        return NextResponse.json({ message: "Invoices set important SuccessFul", success: true }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

