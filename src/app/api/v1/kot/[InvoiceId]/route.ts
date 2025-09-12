import { InternalServerError } from "@/lib/handelError";
import { NextResponse } from "next/server";
import InvoiceKotModel from "@/Model/KOT.model";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import branchModel from "@/Model/branch.model";

export async function GET(request: Request, { params }: { params: Promise<{ InvoiceId: string }> }) {
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


        const SavedKOTs = await InvoiceKotModel.find({
            $and: [
                { invoiceMongoId: InvoiceId },
                { companyId: companyId },
            ],
        }).populate({
            path: "createdBy",
            select: "_id email name phone role"
        }).populate({
            path: 'branchId',
            model: branchModel
        })
        return NextResponse.json({ SavedKOTs, success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}  