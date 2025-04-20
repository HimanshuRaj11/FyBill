import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
const salt = bcrypt.genSaltSync(10);



export async function POST(request: Request) {


    try {
        // await connectDB();
        const userId = await verifyUser();

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }

        const { email, phone, address, name } = await request.json();

        await user.updateOne({
            email,
            phone,
            address,
            name,
        }).then(() => {
            return NextResponse.json({ message: "User updated successfully", success: true });
        }).catch((err: any) => {
            return NextResponse.json({ message: "Failed to update user", error: err, success: false });
        })




        return NextResponse.json({ message: "Staff registered", });
    } catch (error) {
        console.error("Error registering staff:", error);
        return NextResponse.json({ message: "Internal server error" });
    }
}
