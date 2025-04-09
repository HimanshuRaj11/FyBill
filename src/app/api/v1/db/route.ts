import connectDB from "@/lib/DB";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ message: "DB Connected", success: true })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error as Error, error: true }, { status: 503 });

    }
}
