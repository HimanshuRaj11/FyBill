import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Update Currency
        const User_id = await verifyUser();
        if (!User_id) { return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) }

        const User = await UserModel.findById({ _id: User_id });
        if (!User) { return NextResponse.json({ success: false, message: "User not found" }, { status: 404 }) }

        const Company = await CompanyModel.findById({ _id: User.Company_id });
        if (!Company) { return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 }) }

        const { currency, currencySymbol } = await req.json();

        await Company.updateOne({ currency: currency }, { currencySymbol: currencySymbol });

        await Company.save();

        return NextResponse.json({ success: true, message: "Currency Updated" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}
