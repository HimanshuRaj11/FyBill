import { InternalServerError } from "@/lib/handelError";
import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextRequest, NextResponse } from "next/server";

interface IUser {
    _id: string;
    role: string;
}

export async function GET(
    req: NextRequest,
    context: any // ✅ CRITICAL FIX
) {
    try {
        const user_id = await verifyUser();
        const CompanyId = await context.params.CompanyId; // ✅ inferred

        const user = (await UserModel.findById(user_id)
            .select("-password")
            .lean()) as IUser | null;

        if (!user) {
            return NextResponse.json(
                { message: "User not found", error: true },
                { status: 404 }
            );
        }

        const company = await CompanyModel.findById(CompanyId)
            .populate({ path: "branch", model: branchModel })
            .populate({ path: "ownerId", model: UserModel, select: "-password" })
            .lean();

        return NextResponse.json(
            { company, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            InternalServerError(error as Error),
            { status: 503 }
        );
    }
}
