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
        // const start = moment('2025-12-01').startOf('day').toDate();
        // const end = moment('2025-12-31').endOf('day').toDate();
        const branchName = "Georgetown"
        // const branchName = "Berbice"
        const invoiceFilter: any = {
            companyId,
            InvoiceStatus: "Done",
            branchName,
            BillType: { $ne: "KOT" },
            delete: { $ne: true },
            $or: [
                { invoiceIdTrack: { $exists: false } },
                { invoiceIdTrack: null }
            ]
        };

        const invoices = await InvoiceModel.find(invoiceFilter)
            .select("_id branchName createdAt grandTotal invoiceId invoiceIdTrack delete")
            .lean();

        console.log(invoices.length);


        // for (let index = 0; index < invoices.length; index++) {
        //     const inv = invoices[index];
        //     const invoiceFind = await InvoiceModel.findById({ _id: inv._id })
        //     await InvoiceModel.findByIdAndUpdate({ _id: inv._id }, {
        //         $set: { invoiceIdTrack: invoiceFind.invoiceId },
        //     })
        // }

        return NextResponse.json({ message: "Invoice set trackId arranged", }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}


// api/v1/SuperAdmin/Company/[CompanyId]/invoice/SetInvoiceTrackNumber