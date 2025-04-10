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
        const { companyName, industry, website, companySize, street, description, city, state, country, zipCode, contactPhone, contactEmail } = body;
        if (User.companyId) {
            return NextResponse.json({ message: "Company already registered" });
        }
        const Company = await CompanyModel.create({
            name: companyName,
            street: street,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode,
            email: contactEmail,
            phone: contactPhone,
            industry: industry,
            companySize: companySize,
            website: website,
            description: description,
            ownerId: User_id,

        });
        await UserModel.findByIdAndUpdate({ _id: User_id }, { $set: { companyId: Company._id } })
        return NextResponse.json({ message: 'Company registered successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Company registration failed' }, { status: 500 });
    }
}
