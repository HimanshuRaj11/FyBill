import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { InternalServerError } from "./handleError";

interface DecodedToken {
    _id: string;
    key: string;
}
interface UserRoleDecodedToken {
    role: string;
    key: string;
}

export const verifyUser = async (): Promise<string | NextResponse> => {
    try {
        const cookiesObj = await cookies();
        const token = cookiesObj.get("FyBill_auth_token")?.value;
        const UserRoleToken = cookiesObj.get("SSID1")?.value;
        if (!token) {
            return NextResponse.json({ message: "Token not found!" }, { status: 401 });
        }
        if (!UserRoleToken) {
            return NextResponse.json({ message: "User Role not Detected!" }, { status: 401 });
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as DecodedToken;
        if (!decodedToken) {
            return NextResponse.json({ message: "User Not verified!!!" }, { status: 401 });
        }
        const UserRoleDecodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as UserRoleDecodedToken;

        if (UserRoleDecodedToken.role !== "SuperAdmin") {
            return NextResponse.json({ message: "Access Denied! Not a SuperAdmin User" }, { status: 403 });
        }
        return decodedToken._id;
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" });
    }
};