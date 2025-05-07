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
        console.log(user, "old");

        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }

        const { newPassword, currentPassword } = await request.json();
        const CheckPassword = bcrypt.compareSync(currentPassword, user.password);

        if (!CheckPassword) {
            return NextResponse.json({ message: "Wrong Current Password!!", success: false });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        const Up = await user.updateOne({
            password: hashedPassword,
        })
        console.log(Up);

        return NextResponse.json({ message: "Password updated successfully", success: true });

    } catch (error) {
        console.error("Error registering staff:", error);
        return NextResponse.json({ message: "Internal server error" });
    }
}
