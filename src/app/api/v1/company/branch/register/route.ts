import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import BranchModel from "@/Model/branch.model";


export async function POST(req: Request) {
    try {
        const User_id = await verifyUser()

        const User = await UserModel.findById({ _id: User_id })
        if (!User) {
            return NextResponse.json({ message: "User not found", error: true });
        }
        const company = await CompanyModel.findById({ _id: User.companyId })
        if (!company) {
            return NextResponse.json({ message: "Company not found", error: true });
        }
        const body = await req.json();
        const { branchName, street, city, state, country, zipCode, CountryCode, contactPhone, contactEmail } = body;

        const address = {
            street: street,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode,
        }
        const Branch = await BranchModel.create({
            companyId: company._id,
            branchName: branchName,
            address: address,
            email: contactEmail,
            phone: contactPhone,
            CountryCode: CountryCode,
            ownerId: User_id,

        });
        company.branch.push(Branch._id)
        await company.save()
        return NextResponse.json({ message: 'Branch registered successfully', success: true });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Branch registration failed', error: true }, { status: 500 });
    }
}
