import { InternalServerError } from "@/lib/handelError";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user_id = await verifyUser();
        const user = await UserModel.findById({ _id: user_id })
        return NextResponse.json({ user, success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json(InternalServerError(error as Error), { status: 503 });
    }
}