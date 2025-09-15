import { verifyUser } from "@/lib/verifyUser";
import TaxModel from "@/Model/Tax.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import CompanyModel from "@/Model/Company.model";

export async function POST(request: Request) {
    try {
        const User_id = await verifyUser();

        const user = await UserModel.findById(User_id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const company = await CompanyModel.findById(user.companyId);
        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
        }


        const { taxName, percentage } = await request.json();

        let tax = await TaxModel.findOne({ companyId: company._id });

        if (!tax) {
            tax = await TaxModel.create({
                companyId: company._id,
                taxes: [{ taxName, percentage }]
            });
        } else {
            tax.taxes.push({ taxName, percentage });
            await tax.save();
        }

        return NextResponse.json({ success: true, message: "Tax created successfully", tax });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false, message: "Failed to create tax", error: error as Error }, { status: 500 });
    }
}