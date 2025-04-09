import UserModel from "@/Model/User.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";


interface TokenData {
    _id: mongoose.Schema.Types.ObjectId;
}
export async function POST(request: Request) {

    try {
        // await connectDB();
        const InputData = await request.json()
        const { email, password, } = InputData;

        // 2. Check if Owner with email already exists

        const existing = await UserModel.findOne({ email })
        if (!existing) {
            return NextResponse.json({ message: "Email not Found!!" });
        }

        const CheckPassword = bcrypt.compareSync(password, existing.password);

        if (!CheckPassword) {
            return NextResponse.json({ message: "Authentication Failed!" });
        }

        const tokenData: TokenData = {
            _id: existing._id
        };

        // Create token
        const token: string = jwt.sign(tokenData, process.env.TOKEN_SECRET as string);

        const response = NextResponse.json({ message: `Login Successful`, success: true }, { status: 200 });
        response.cookies.set("FyBill_auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365
        });
        return response;

    } catch (error) {

    }

}