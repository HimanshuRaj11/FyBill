import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import ProductCategoryModel from "@/Model/Category.model";
import ProductModel from "@/Model/Product.model";
import TaxModel from "@/Model/Tax.model";
import BranchModel from "@/Model/branch.model";
export async function POST(request: Request) {
    try {
        const user_id = await verifyUser()
        if (!user_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = await UserModel.findById({ _id: user_id })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (user?.role !== "Owner") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const company = await CompanyModel.findById({ _id: user?.companyId });
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }
        const branch = await BranchModel.findById({ _id: user?.branchId });
        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }
        const branchId = await request.json()
        if (!branchId) {
            return NextResponse.json({ error: "Branch ID is required" }, { status: 400 });
        }
        await BranchModel.findByIdAndDelete({ _id: branchId });

        return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
    }
}