import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    try {
        const user_id = await verifyUser();
        const { invoiceId, paymentMode } = await request.json();

        if (!user_id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: user_id });

        if (!User) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        // if (User.role != "SUPERADMIN") {
        //     return NextResponse.json({ message: "Forbidden", success: false }, { status: 403 });
        // }

        const invoice = await InvoiceModel.findByIdAndUpdate(
            { _id: invoiceId },
            { paymentMode },
            { new: true }
        );


        return NextResponse.json({ invoice, success: true }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

