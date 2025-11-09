import UserModel from "@/Model/User.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import CompanyModel from "@/Model/Company.model";
import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import branchModel from "@/Model/branch.model";

const list = [
    "4946", "4947", "4948", "4949", "4950", "4951", "4952",
    "4953", "4954", "4955"
]


export async function GET(request: Request) {

    try {


        return NextResponse.json({ message: "Pong", }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}