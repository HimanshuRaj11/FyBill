import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const User_id = await verifyUser()
        if (!User_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const User = await UserModel.findById(User_id)
        if (!User) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        if (User.role !== "admin" && User.role !== "Owner") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (User.role === "Owner") {
            return NextResponse.json({ error: "Owner cannot be deleted" }, { status: 400 })
        }
        if (User._id === User_id) {
            return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 })
        }

        const { _id } = await request.json();
        const Staff = await UserModel.findById({ _id: _id })
        if (!Staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 })
        }
        await UserModel.findByIdAndDelete({ _id: _id })
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}       