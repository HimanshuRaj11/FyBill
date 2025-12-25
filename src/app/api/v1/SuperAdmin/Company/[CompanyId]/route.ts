import { InternalServerError } from "@/lib/handelError";
import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

interface IUser {
    _id: string;
    role: string;
}

export async function GET(req: Request, { params }: { params: { CompanyId: string } }) {
    try {

        const user_id = await verifyUser();
        const { CompanyId } = await params;

        const user = await UserModel.findById(user_id).select("-password").lean() as IUser | null;
        if (!user) {
            return NextResponse.json({ message: "User not found", error: true }, { status: 404 });
        }
        // if (user.role !== 'superAdmin') {
        //     return NextResponse.json({ message: "Unauthorized Access", error: true }, { status: 401 });
        // }
        const company: any = await CompanyModel.findOne({ _id: CompanyId })
            .populate({ path: "branch", model: branchModel })
            .populate({ path: "ownerId", model: UserModel, select: "-password" })
            .lean();
        console.log(company);


        return NextResponse.json({ company, success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}