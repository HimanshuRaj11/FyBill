

import StaffModel from "@/Model/User.model";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/DB";

interface TokenData {
    _id: mongoose.Schema.Types.ObjectId;
}
// 1. Zod schema for validation

const staffSchema = z.object({
    companyId: z.string().length(24, "Invalid ID"),
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    password: z.string().min(6, "Password should be at least 6 characters"),
    address: z.string().optional(),
    role: z.string().optional(),
});

export default async function POST(request: Request) {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" });
    }

    try {
        await connectDB();

        const parsed = staffSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.flatten().fieldErrors });
        }

        const { companyId, name, phone, email, password, address, role } = await request.json();

        // 2. Check if staff with email already exists
        const existing = await StaffModel.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: "Staff with this email already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create staff entry
        const newStaff = await StaffModel.create({
            companyId,
            name,
            phone,
            email,
            address,
            role,
            password: hashedPassword,
        });

        const tokenData: TokenData = {
            _id: newStaff._id
        };

        // Create token
        const token: string = jwt.sign(tokenData, process.env.TOKEN_SECRET as string);

        const response = NextResponse.json({ message: `Hii! ${name}, Welcome to FyBill` });
        response.cookies.set("FyBill_auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure cookie in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 365
        });

        return NextResponse.json({ message: "Staff registered", staff: newStaff });
    } catch (error) {
        console.error("Error registering staff:", error);
        return NextResponse.json({ message: "Internal server error" });
    }
}
