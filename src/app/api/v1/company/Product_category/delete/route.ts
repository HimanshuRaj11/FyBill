import { verifyUser } from "@/lib/verifyUser";
import ProductCategoryModel from "@/Model/Category.model";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

        const { categoryName } = await request.json();

        const existingCategory = await ProductCategoryModel.findOne({ companyId: company._id, category: categoryName });
        if (existingCategory) {
            existingCategory.category = existingCategory.category.filter((cat: string) => cat !== categoryName);
            await existingCategory.save();
            return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: "Category not found" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to add category", error: error as Error }, { status: 500 });
    }
}
