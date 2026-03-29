import { verifyUser } from "@/lib/verifyUser";
import branchModel from "@/Model/branch.model";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import KOTModel from "@/Model/KOT.model";
import UserModel from "@/Model/User.model";
import moment from "moment";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";


export async function POST(request: Request) {

    try {
        const { TARGET, startDate, endDate, branchId } = await request.json();

        // const startDate = moment('2026-03-01').startOf('day').toDate();
        // const start = moment(startDate).startOf('day').toDate();
        // const end = moment(endDate).endOf('day').toDate();
        const branchName = "Berbice"

        const filter = {
            issueDate: { $gte: startDate },
            delete: false,
            important: { $ne: true },
            BillType: { $ne: "KOT" },
            // branchName,
            branchId
        }



        const invoices = await InvoiceModel.find(filter) as any;


        let currentTotal = await invoices.reduce((sum: any, inv: any) => sum + Number(inv.grandTotal), 0);

        const target = TARGET / 2;
        if (currentTotal <= target) {
            return NextResponse.json({ message: "Current value is Already below target", currentTotal });
        }

        const invoicesToDelete: any = [];
        console.log(invoicesToDelete);

        const pool = [...invoices];

        while (currentTotal > target && pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selected = pool[randomIndex];

            invoicesToDelete.push(selected._id);

            currentTotal -= Number(selected.grandTotal);
            pool.splice(randomIndex, 1);
        }

        await InvoiceModel.updateMany(
            { _id: { $in: invoicesToDelete } },
            { $set: { delete: true } }
        );

        const Branch = await branchModel.findOneAndUpdate({ _id: branchId }, {
            lastInvoiceCheck: new Date()
        })

        return NextResponse.json({
            branchName: Branch?.branchName,
            message: "Invoices Deleted SuccessFul", success: true
        }, { status: 200 });

        // return NextResponse.json({ message: "done", invoices }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

