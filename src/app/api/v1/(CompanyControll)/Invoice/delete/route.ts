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

        // const {TARGET, startDate, endDate, branchName, companyId} = await request.json();

        const companyId = "6803e4c62a9cdbcaf5b3e6e4"
        const branchName = "Georgetown" //  1.6 per day
        // const branchName = "Berbice" // 1.3 per day

        const start = moment('2025-12-19').startOf('day').toDate();
        const end = moment('2025-12-31').endOf('day').toDate(); // 23rd December

        const invoiceFilter: any = {
            companyId,
            branchName,
            createdAt: { $gte: start, $lte: end },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
            important: { $ne: true }
        };
        const TARGET = 820000;
        const invoices = await InvoiceModel.find(invoiceFilter).select("_id grandTotal").lean();
        // const invoices = await InvoiceModel.updateMany(invoiceFilter, {
        //     $set: { delete: false }
        // })

        let currentTotal = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal), 0);

        console.log("CURRENT TOTAL:", currentTotal);

        if (currentTotal <= TARGET) {
            return NextResponse.json({ message: "Already below target", currentTotal });
        }

        const invoicesToDelete = [];

        const pool = [...invoices];

        while (currentTotal > TARGET && pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selected = pool[randomIndex];

            invoicesToDelete.push(selected._id);

            currentTotal -= Number(selected.grandTotal);
            pool.splice(randomIndex, 1);
        }

        console.log("FINAL TOTAL AFTER SUBTRACTION:", currentTotal);
        console.log("INVOICES TO DELETE:", invoicesToDelete.length);


        await InvoiceModel.updateMany(
            { _id: { $in: invoicesToDelete } },
            { $set: { delete: true } }
        );



        return NextResponse.json({
            invoicesToDelete, l: invoicesToDelete.length,
            message: "Invoices Deleted SuccessFul", success: true
        }, { status: 200 });

        // return NextResponse.json({ message: "done", }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

