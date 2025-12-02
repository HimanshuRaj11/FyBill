import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import BranchModel from "@/Model/branch.model";
import { json } from "stream/consumers";
export async function PUT(request: Request, { params }: { params: Promise<{ branchId: string }> }) {

    try {
        const userId = await verifyUser();
        const { branchId } = await params;
        const user = await UserModel.findById({ _id: userId })
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }

        const userCompanyId = user.companyId;
        const Branch = await BranchModel.findOne({ _id: branchId, companyId: userCompanyId }).lean()
        if (user.role != 'Owner') {
            return NextResponse.json({ message: "Unauthorize User", success: false }, { status: 500 });
        }
        const { branchName, street, city, state, zipCode, phone, countryCode, email } = await request.json()
        return NextResponse.json({ Branch, success: true });


    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}