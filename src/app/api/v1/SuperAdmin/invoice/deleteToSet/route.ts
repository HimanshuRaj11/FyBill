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
        const { TARGET, startDate, endDate, branchId } = await request.json();

        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        const invoiceFilter: any = {
            createdAt: { $gte: startDate, $lte: endDate },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            delete: false,
            important: { $ne: true }
        };
        // const TARGET = 820000;
        const invoices = await InvoiceModel.find(invoiceFilter).select("_id grandTotal").lean();

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

        await branchModel.findOneAndUpdate({ _id: branchId }, {
            lastInvoiceCheck: new Date()
        })



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

