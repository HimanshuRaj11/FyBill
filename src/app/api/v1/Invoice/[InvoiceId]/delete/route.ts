import { verifyUser } from "@/lib/verifyUser";
import { NextResponse } from "next/server";
import InvoiceModel from "@/Model/Invoice.model";


export async function DELETE(req: Request, { params }: { params: Promise<{ InvoiceId: string }> }) {
    try {

        const { InvoiceId } = await params;
        console.log(InvoiceId);

        const user_id = await verifyUser();
        if (!user_id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const invoice = await InvoiceModel.findOne({ _id: InvoiceId });
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found", success: false }, { status: 404 });
        }

        await InvoiceModel.deleteOne({ _id: InvoiceId });
        return NextResponse.json({ message: "Invoice deleted successfully", success: true }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}   
