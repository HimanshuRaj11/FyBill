import { verifyUser } from "@/lib/verifyUser";
import { NextResponse } from "next/server";
import InvoiceModel from "@/Model/Invoice.model";
import InvoiceKotModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import KOTModel from "@/Model/KOT.model";

export async function DELETE(req: Request, { params }: { params: Promise<{ InvoiceId: string }> }) {
    try {

        const { InvoiceId } = await params;
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
        const invoice = await InvoiceModel.findOne({ _id: InvoiceId });
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found", success: false }, { status: 404 });
        }

        // check if invoice is important
        if (invoice.important) {
            return NextResponse.json({ message: "Cannot delete an important invoice", success: false }, { status: 400 });
        }

        await InvoiceModel.findByIdAndUpdate({ _id: InvoiceId }, {
            delete: true
        }).then(async () => {
            await KOTModel.deleteMany({
                $and: [
                    { invoiceMongoId: InvoiceId },
                    { companyId: companyId },
                ],
            })
        })

        return NextResponse.json({ message: "Invoice deleted successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}   
