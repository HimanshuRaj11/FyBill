import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET(Request: Request, { params }: { params: Promise<{ StaffId: string }> }) {
    try {
        const user_id = await verifyUser();
        const { StaffId } = await params;

        if (!user_id) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: user_id });

        if (!User) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }
        const companyId = User.companyId;
        const company = await CompanyModel.findById({ _id: companyId });
        if (!company) {
            return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });
        }
        const Staff = await UserModel.findOne({ _id: StaffId }).populate({
            path: 'branchId',
            model: branchModel
        })

        if (!Staff) {
            return NextResponse.json({ message: "Staff not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ Staff, success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}