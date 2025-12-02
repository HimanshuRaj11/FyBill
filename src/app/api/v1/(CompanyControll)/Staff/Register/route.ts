import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
const salt = bcrypt.genSaltSync(10);



export async function POST(request: Request) {


    try {
        // await connectDB();
        const userId: any = await verifyUser();

        const User = await UserModel.findById({ _id: userId })

        if (!User) {
            return NextResponse.json({ message: "User not found", error: true });
        }
        const userCompanyId = User.companyId

        const { name, phone, email, password, address, role, branchId } = await request.json();




        // 2. Check if staff with email already exists
        const existing = await UserModel.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: "Staff with this email already exists", error: true });
        }

        // 3. Hash password
        const hashedPassword = bcrypt.hashSync(password, salt);


        // 4. Create staff entry
        const newStaff = await UserModel.create({
            companyId: userCompanyId,
            branchId,
            name,
            phone,
            email,
            address,
            role,
            password: hashedPassword,
        });


        return NextResponse.json({ message: "Staff registered", success: true });
    } catch (error) {
        console.error("Error registering staff:", error);
        return NextResponse.json({ message: "Internal server error", error: true }, { status: 500 });
    }
}
