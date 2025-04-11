import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/Model/Product.model";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
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
        const checkUserRole = User.role === 'Owner' || User.role === 'admin';
        if (!checkUserRole) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }

        const company = await CompanyModel.findById({ _id: User.companyId });
        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' });
        }
        const { _id, name, price, description, category } = await request.json();
        const product = await ProductModel.findByIdAndUpdate({ _id: _id }, { name, price, description, category });
        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' });
        }
        return NextResponse.json({ success: true, message: "Product updated" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }

}

