import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import KOTModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import moment from "moment";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    try {
        // const { TARGET, startDate, endDate, branchId } = await request.json();

        const start = moment('2026-01-01').startOf('day').toDate();
        // const end = moment('2025-12-31').endOf('day').toDate();

        const invoiceFilter: any = {
            createdAt: { $gte: start },
            delete: true,
            important: { $ne: true },
            // branchId: branchId,
        };
        const invoices = await InvoiceModel.find(invoiceFilter).select('delete _id branchName invoiceId').lean();

        await Promise.all(invoices.map((inv) =>
            InvoiceModel.findByIdAndUpdate(
                inv._id,
                { $set: { delete: false } }
            )
        ));

        return NextResponse.json({ message: "Invoices Recover SuccessFul", invoices, success: true }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

