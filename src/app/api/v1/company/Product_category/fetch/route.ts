import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import ProductCategoryModel from "@/Model/Category.model";
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

        const category = await ProductCategoryModel.findOne({ companyId: company._id });
        if (!category) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
        }
        console.log(category);
        return NextResponse.json({ success: true, category });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch category", error: error as Error }, { status: 500 });
    }
}   
