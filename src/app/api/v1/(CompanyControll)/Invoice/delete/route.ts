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


        const companyId = "6803e4c62a9cdbcaf5b3e6e4"
        // const branchName = "Georgetown"
        const branchName = "Berbice"

        const start = moment('2025-06-01').startOf('day').toDate();
        const end = moment('2025-06-30').endOf('day').toDate();

        const invoiceFilter: any = {
            companyId,
            branchName,
            createdAt: { $gte: start, $lte: end },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
            important: { $ne: true }
        };
        const TARGET = 690000;
        const invoices = await InvoiceModel.find(invoiceFilter).select("_id grandTotal").lean();


        // const invoiceIds = invoices.map(inv => inv._id);

        // if (invoiceIds.length) {
        //     const result = await InvoiceModel.updateMany(
        //         { _id: { $in: invoiceIds } },
        //         { $set: { delete: false } }
        //     );
        //     // console.log("matched:", result.matchedCount ?? result.n ?? 0, "modified:", result.modifiedCount ?? result.nModified ?? 0);
        // } else {
        //     console.log("No invoices found to update");
        // }

        // const invoicesToDelete = invoiceIds;


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

        // Delete related KOT documents

        // await KOTModel.deleteMany(
        //     { invoiceModelId: { $in: invoices } }
        // );




        return NextResponse.json({
            invoicesToDelete, l: invoicesToDelete.length,
            message: "Invoices Deleted SuccessFul", success: true
        }, { status: 200 });

        // return NextResponse.json({ message: "done", 1: invoices.length, currentTotal, }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

