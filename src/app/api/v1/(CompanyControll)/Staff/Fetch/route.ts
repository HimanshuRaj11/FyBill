import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const userId = await verifyUser();
        const user = await UserModel.findById({ _id: userId })
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        const userCompanyId = user.companyId;

        const staff = await UserModel.find({ companyId: userCompanyId }).select("-password").lean()

        return NextResponse.json({ staff });


    } catch (error) {
        return NextResponse.json({ message: "Internal server error" });
    }
}