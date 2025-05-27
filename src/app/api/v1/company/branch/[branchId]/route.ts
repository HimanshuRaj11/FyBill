import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";
import BranchModel from "@/Model/branch.model";
export async function GET(request: Request, { params }: { params: Promise<{ branchId: string }> }) {

    try {
        const userId = await verifyUser();
        const { branchId } = await params;
        const user = await UserModel.findById({ _id: userId })
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        const userCompanyId = user.companyId;
        const Branch = await BranchModel.findOne({ _id: branchId, companyId: userCompanyId }).lean()
        return NextResponse.json({ Branch, success: true });


    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}