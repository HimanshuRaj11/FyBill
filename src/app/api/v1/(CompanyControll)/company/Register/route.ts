import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const User_id = await verifyUser()

        const User = await UserModel.findById({ _id: User_id })
        if (!User) {
            return NextResponse.json({ message: "User not found", error: true }, { status: 404 });
        }
        const body = await req.json();
        const { companyName, industry, website, companySize, street, description, city, state, country, zipCode, countryCode, contactPhone, contactEmail } = body;
        if (User.companyId) {
            return NextResponse.json({ message: "Company already registered", error: true }, { status: 400 });
        }
        const address = {
            street: street,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode,
        }
        const Company = await CompanyModel.create({
            name: companyName,
            address: address,
            email: contactEmail,
            countryCode: countryCode,
            phone: contactPhone,
            industry: industry,
            companySize: companySize,
            website: website,
            description: description,
            ownerId: User_id,

        });
        await UserModel.findByIdAndUpdate({ _id: User_id }, { $set: { companyId: Company._id } })

        return NextResponse.json({ message: 'Company registered successfully', success: true, Company }, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Company registration failed', error: true }, { status: 500 });
    }
}
