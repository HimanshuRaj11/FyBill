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

        const { newPassword, currentPassword } = await request.json();
        const CheckPassword = bcrypt.compareSync(currentPassword, user.password);

        if (!CheckPassword) {
            return NextResponse.json({ message: "Wrong Password!!" });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        await user.updateOne({
            password: hashedPassword,
        }).then(() => {
            return NextResponse.json({ message: "Password updated successfully", success: true });
        }).catch((err: any) => {
            return NextResponse.json({ message: "Failed to update Password", error: err, success: false });
        })




        return NextResponse.json({ message: "Staff registered", });
    } catch (error) {
        console.error("Error registering staff:", error);
        return NextResponse.json({ message: "Internal server error" });
    }
}
