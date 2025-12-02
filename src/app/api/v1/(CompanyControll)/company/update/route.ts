import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const User_id = await verifyUser()

        const User = await UserModel.findById({ _id: User_id })
        if (!User) {
            return NextResponse.json({ message: "User not found" });
        }
        const body = await req.json();
        const company = await CompanyModel.findById({ _id: User.companyId })
        if (!company) {
            return NextResponse.json({ message: "Company not found" });
        }
        const { companyName, industry, website, companySize, address, description, contactPhone, contactEmail } = body;

        await company.updateOne({
            name: companyName,
            address: address,
            email: contactEmail,
            phone: contactPhone,
            industry: industry,
            companySize: companySize,
            website: website,
            description: description,
            ownerId: User_id,

        });
        return NextResponse.json({ message: 'Company updated successfully', success: true });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Company update failed', success: false });
    }
}
