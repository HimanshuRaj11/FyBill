import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import { AlwaysDeleteInvoiceByName } from "@/data/InvoiceData";

export async function POST(request: Request) {

    try {

        const user_id = await verifyUser();
        if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        await InvoiceModel.updateMany(
            {
                $or: [
                    { important: { $ne: true } },
                    { clientName: { $in: AlwaysDeleteInvoiceByName } }
                ]
            },
            { $set: { "delete": false } }
        )

        return NextResponse.json({ message: "Invoices Deleted SuccessFul", success: true }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
