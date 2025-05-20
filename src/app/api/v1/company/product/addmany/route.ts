import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/Model/Product.model";
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";
import CompanyModel from "@/Model/Company.model";
import { MenuData } from "@/data/menu";
export async function POST(request: NextRequest) {
    try {
        MenuData.map(async (menu) => {

            const product = await ProductModel.create(menu);
        })
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }

}

