import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import { NextResponse } from "next/server";
import TaxModel from "@/Model/Tax.model";

export async function POST(request: Request) {

    try {
        const User_id = await verifyUser();
        if (!User_id) { return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) }

        const User = await UserModel.findById({ _id: User_id });
        if (!User) { return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }) }

        const Company = await CompanyModel.findById({ _id: User.companyId });
        if (!Company) { return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 }) }

        const tax = await TaxModel.findOne({ companyId: Company._id });
        if (!tax) { return NextResponse.json({ success: false, message: "Tax not found" }, { status: 404 }) }

        const { taxName, percentage, _id } = await request.json();

        const updatedTax = tax.taxes.find((tax: any) => tax._id.toString() === _id);
        if (!updatedTax) { return NextResponse.json({ success: false, message: "Tax not found" }, { status: 404 }) }

        updatedTax.taxName = taxName;
        updatedTax.percentage = percentage;

        await tax.save();

        return NextResponse.json({ success: true, message: "Tax updated", }, { status: 200 })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }

}