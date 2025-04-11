import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import ProductCategoryModel from "@/Model/Category.model";
import ProductModel from "@/Model/Product.model";
import TaxModel from "@/Model/Tax.model";

export async function DELETE(request: Request) {
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
        // Delete all non-owner users associated with the company
        await UserModel.deleteMany({
            companyId: company._id,
            role: { $ne: "Owner" }
        });

        // Update owner user to remove company association

        user.updateOne({
            $unset: { companyId: "" }
        });

        // Delete all invoices associated with the company
        await InvoiceModel.deleteMany({
            companyId: company._id
        });
        await ProductCategoryModel.deleteMany({
            companyId: company._id
        });
        await ProductModel.deleteMany({
            companyId: company._id
        });
        await TaxModel.deleteMany({
            companyId: company._id
        });
        await CompanyModel.findByIdAndDelete({ _id: company?._id });

        return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
    }
}