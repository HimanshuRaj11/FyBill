import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import TaxModel from "@/Model/Tax.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const User_id = await verifyUser();

        const user = await UserModel.findById({ _id: User_id });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const company = await CompanyModel.findById({ _id: user.companyId });
        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
        }

        const tax = await TaxModel.findOne({ companyId: company._id }).lean()

        return NextResponse.json({ success: true, tax });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch tax", error: error as Error }, { status: 500 });
    }
}