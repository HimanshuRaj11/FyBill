import UserModel from "@/Model/User.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import CompanyModel from "@/Model/Company.model";
import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import branchModel from "@/Model/branch.model";
import moment from "moment";


export async function POST(request: Request) {

    try {

        // const user_id = await verifyUser();
        // if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        // const User = await UserModel.findById(user_id);
        // if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        // const companyId = User.companyId;
        // const company = await CompanyModel.findById(companyId);
        // if (!company) return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });


        // Set delete: false on all invoices
        // const updateResult = await InvoiceModel.updateMany({}, { $set: { delete: false } });
        // console.log("Invoice update result:", updateResult);


        const companyId = "6803e4c62a9cdbcaf5b3e6e4"
        const start = moment('2025-12-01').startOf('day').toDate();
        const end = moment('2025-12-31').endOf('day').toDate();
        const branchName = "Georgetown"
        // const branchName = "Berbice"
        const invoiceFilter: any = {
            createdAt: { $gte: start, $lte: end },
            companyId: companyId,
            InvoiceStatus: "Done",
            branchName,
            BillType: { $ne: "KOT" },
            delete: { $ne: true },
            // important: { $ne: true }
        };


        ////-------code to reset invoiceId to invoiceIdTrack first------
        // const invoices = await InvoiceModel.find(invoiceFilter)

        // for (let index = 0; index < invoices.length; index++) {
        //     const inv = invoices[index];
        //     await InvoiceModel.findByIdAndUpdate({ _id: inv._id }, {
        //         invoiceId: inv.invoiceIdTrack,
        //     })
        // }
        ////----------------

        // actual code to arrange sequence........

        const invoices = await InvoiceModel.find(invoiceFilter)
            .select("_id branchName createdAt grandTotal invoiceId delete")
            .lean();
        for (let index = 0; index < invoices.length; index++) {
            const inv = invoices[index];
            await InvoiceModel.findByIdAndUpdate({ _id: inv._id }, {
                invoiceId: index + 1,
            })
        }

        const Branch = await branchModel.findOne({ branchName })
        Branch.lastInvoiceNo = invoices.length + 1;
        await Branch.save();

        return NextResponse.json({ message: "Invoice sequence arranged", }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}


