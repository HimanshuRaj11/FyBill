import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/Model/Product.model";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";


interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    branchId: any;
}
export async function PUT(request: NextRequest) {
    try {
        const User_id = await verifyUser();
        if (!User_id) {
            return NextResponse.json({ error: true, message: 'Unauthorized' });
        }
        const User = await UserModel.findById({ _id: User_id });
        if (!User) {
            return NextResponse.json({ error: true, message: 'User not found' });
        }

        const company = await CompanyModel.findById({ _id: User.companyId });
        if (!company) {
            return NextResponse.json({ error: true, message: 'Company not found' });
        }
        const { products } = await request.json();

        products.map(async (product: Product) => {

            const Product = await ProductModel.findByIdAndUpdate(product._id,
                { $set: product },
                { new: true });
            if (!Product) {
                return NextResponse.json({ success: false, error: 'Product not found' });
            }
        })
        return NextResponse.json({ success: true, message: "All Product updated" });
    } catch (error) {
        return NextResponse.json({ error: true, message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }

}

