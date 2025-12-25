import { InternalServerError } from "@/lib/handelError";
import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

interface IUser {
    _id: string;
    role: string;
}

export async function GET() {
    try {
        const user_id = await verifyUser();

        const user = await UserModel.findById(user_id).select("-password").lean() as IUser | null;
        if (!user) {
            return NextResponse.json({ message: "User not found", error: true }, { status: 404 });
        }
        // if (user.role !== 'superAdmin') {
        //     return NextResponse.json({ message: "Unauthorized Access", error: true }, { status: 401 });
        // }
        const companies = await CompanyModel.find().populate({
            path: "ownerId",
            model: UserModel,
            select: "name email"
        }).lean();
        return NextResponse.json({ companies, success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}