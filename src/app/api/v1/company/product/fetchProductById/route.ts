import { verifyUser } from "@/lib/verifyUser";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import ProductModel from "@/Model/Product.model";

export async function POST(request: NextRequest) {
    try {
        const User_id = await verifyUser();
        if (!User_id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        const User = await UserModel.findById({ _id: User_id });
        if (!User) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }
        const company = await CompanyModel.findById({ _id: User.companyId });
        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' });
        }
        const Product_id = await request.json()
        const products = await ProductModel.find({ _id: Product_id });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
}
