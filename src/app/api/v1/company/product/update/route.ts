import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/Model/Product.model";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
export async function PUT(request: NextRequest) {
    try {
        const User_id = await verifyUser();
        if (!User_id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        const User = await UserModel.findById({ _id: User_id });
        if (!User) {
            return NextResponse.json({ error: true, message: 'User not found' });
        }
        const company = await CompanyModel.findById({ _id: User.companyId });
        if (!company) {
            return NextResponse.json({ message: 'Company not found', error: true });
        }
        const { product } = await request.json();
        const { _id, name, price, description, category, branchId } = product;

        const Product = await ProductModel.findByIdAndUpdate({ _id: _id }, { name, price, description, category, branchId });
        if (!Product) {
            return NextResponse.json({ success: false, error: 'Product not found' });
        }
        return NextResponse.json({ success: true, message: "Product updated" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }

}

