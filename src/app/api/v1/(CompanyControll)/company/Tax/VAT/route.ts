import { verifyUser } from "@/lib/verifyUser";
import TaxModel from "@/Model/Tax.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import CompanyModel from "@/Model/Company.model";

export async function POST(request: Request) {
    try {
        // const User_id = await verifyUser();

        // const user = await UserModel.findById(User_id);
        // if (!user) {
        //     return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        // }

        // const company = await CompanyModel.findById(user.companyId);
        // if (!company) {
        //     return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
        // }
        const companyId = "67f95fe7d8e506556f011fd4";

        // Use the id form and request the updated document back
        const company = await CompanyModel.findByIdAndUpdate(
            companyId,
            { $set: { vatId: "TIN: 114-461-876" } },
        );

        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Tax created successfully", company }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create tax", error: error as Error }, { status: 500 });
    }
}