import connectDB from "@/lib/DB";
import { InternalServerError } from "@/lib/handelError";
import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const user_id = await verifyUser();
        console.log(user_id);

        const user = await UserModel.findById({ _id: user_id }).select("-password").populate({
            path: 'branchId',
            model: branchModel
        }).lean()
        return NextResponse.json({ user, success: true }, { status: 200 })

    } catch (error) {
        console.log(error);

        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}