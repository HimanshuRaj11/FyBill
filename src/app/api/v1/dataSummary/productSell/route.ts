import { IUser } from './../../../../../Model/User.model';
import { verifyUser } from "@/lib/verifyUser";
import UserModel from "@/Model/User.model";


export async function GET(request: Request) {
    try {
        const user_id = await verifyUser()
        // const user{ user: IUser } = UserModel.findById({ _id: user_id })

        // const companyId = user?.companyId


        return Response.json({ message: "Invoice created successfully" }, { status: 200 });

    } catch (error) {
        console.log(error);

        return Response.json({ message: "Internal server error", error }, { status: 500 });
    }

}