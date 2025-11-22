import { verifyUser } from "@/lib/verifyUser";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import ProductModel from "@/Model/Product.model";
import branchModel from "@/Model/branch.model";

export async function GET(request: NextRequest) {
    try {
        const User_id = await verifyUser();
        if (!User_id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        const User = await UserModel.findById({ _id: User_id });
        if (!User) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }
        if (User.branchId) {
            const products = await ProductModel.find({ branchId: User.branchId }).populate({
                path: 'branchId',
                model: branchModel
            }).lean();

            return NextResponse.json({ success: true, products });
        }
        const company = await CompanyModel.findById({ _id: User.companyId });
        if (!company) {
            return NextResponse.json({ success: false, error: 'Company not found' });
        }
        const products = await ProductModel.find({ companyId: company._id }).populate({
            path: 'branchId',
            model: branchModel
        }).lean();

        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
}
