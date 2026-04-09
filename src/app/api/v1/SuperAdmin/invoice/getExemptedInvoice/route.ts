import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    try {

        // const user_id = await verifyUser();
        // if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        const startDate = moment('2026-03-01').startOf('day').toDate();
        // const branchName = 'Berbice' //  Georgetown
        const filter = {
            isExempted: true,
            issueDate: { $gte: startDate },
            InvoiceStatus: "Done",
            companyId: "6803e4c62a9cdbcaf5b3e6e4"
        }
        const invoice = await InvoiceModel.find(filter).select("-products -appliedTaxes -important").sort({ issueDate: -1 }).lean();


        return NextResponse.json({ message: " SuccessFul", length: invoice.length, success: true, invoice }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}
