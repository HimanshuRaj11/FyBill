import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { InternalServerError } from "./handleError";

// interface DecodedToken {
//     _id: string;
//     key: string;
// }

export const CheckUserRole = async (): Promise<string | NextResponse> => {
    try {
        const cookiesObj = await cookies();
        const token = cookiesObj.get("FyBill_role_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Token not found!" }, { status: 401 });
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as any;
        if (!decodedToken) {
            return NextResponse.json({ message: "User Not verified!!!" }, { status: 401 });
        }
        console.log(decodedToken, "decoded token in CheckUserRole");

        return decodedToken;
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" });
    }
};