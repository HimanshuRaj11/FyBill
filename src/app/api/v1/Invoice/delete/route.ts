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
        // const branchName2 = "Berbice"

        const start = moment('2025-07-01').startOf('day').toDate();
        const end = moment('2025-07-31').endOf('day').toDate();

        const invoiceFilter: any = {
            companyId,
            branchName: "Berbice",
            createdAt: { $gte: start, $lte: end },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
        };
        const TARGET = 1200000; // 25 lakh

        // 1. Fetch invoices that are NOT deleted
        const invoices = await InvoiceModel.find(invoiceFilter).select("_id branchName createdAt grandTotal invoiceId delete")

        // 2. Calculate current total
        let currentTotal = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal), 0);

        console.log("CURRENT TOTAL:", currentTotal);

        // If total already less than target
        if (currentTotal <= TARGET) {
            return NextResponse.json({ message: "Already below target", currentTotal });
        }

        // 3. Select random invoices until total <= target
        const invoicesToDelete = [];

        // Clone array so we can randomly remove from it
        const pool = [...invoices];

        while (currentTotal > TARGET && pool.length > 0) {
            // Pick a random invoice
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selected = pool[randomIndex];

            // Add to delete list
            invoicesToDelete.push(selected._id);

            // Subtract from total
            currentTotal -= Number(selected.grandTotal);

            // Remove from pool
            pool.splice(randomIndex, 1);
        }

        console.log("FINAL TOTAL AFTER SUBTRACTION:", currentTotal);
        console.log("INVOICES TO DELETE:", invoicesToDelete.length);


        await InvoiceModel.updateMany(
            { _id: { $in: invoicesToDelete } },
            { $set: { delete: true } }
        );

        // Delete related KOT documents
        await KOTModel.deleteMany(
            { invoiceModelId: { $in: invoicesToDelete } }
        );




        return NextResponse.json({
            invoicesToDelete, l: invoicesToDelete.length,
            message: "Invoices Deleted SuccessFul", success: true
        }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

