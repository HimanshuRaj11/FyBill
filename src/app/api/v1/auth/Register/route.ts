
import connectDB from "@/lib/DB";
import UserModel from "@/Model/User.model";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface TokenData {
    _id: mongoose.Schema.Types.ObjectId;
}
// 1. Zod schema for validation

const OwnerSchema = z.object({
    // companyId: z.string().length(24, "Invalid ID"),
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    password: z.string().min(6, "Password should be at least 6 characters"),
    // address: z.string().optional(),
    role: z.string().optional(),
});

export async function POST(request: Request) {
    await connectDB();
    try {
        const salt = bcrypt.genSaltSync(10);
        const InputData = await request.json()

        const parsed = OwnerSchema.safeParse(InputData);
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.flatten().fieldErrors });
        }

        const { name, phone, email, password, } = InputData;


        // 2. Check if Owner with email already exists
        const existing = await UserModel.findOne({ email })
        if (existing) {
            return NextResponse.json({ message: "Owner with this email already exists" });
        }

        // 3. Hash password
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 4. Create Owner entry
        const newUser = await UserModel.create({
            name,
            phone,
            email,
            password: hashedPassword,
            role: "Owner",
        });

        const tokenData: TokenData = {
            _id: newUser._id
        };

        // Create token
        const token: string = jwt.sign(tokenData, process.env.TOKEN_SECRET as string);

        const response = NextResponse.json({ message: `Hii! ${name}, Welcome to FyBill`, success: true }, { status: 201 });
        response.cookies.set("FyBill_auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365
        });
        return response;

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error: true }, { status: 500 });
    }
}
