import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("FyBill_auth_token");
        return NextResponse.json({ message: "Logged out" })
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" })
    }
}

