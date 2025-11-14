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
import clsx from "clsx";


export async function GET(request: Request) {

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


        // start from July 1 of the current fiscal year (if today is on/after July 1 use this year, otherwise use previous year)
        const companyId = "6803e4c62a9cdbcaf5b3e6e4"
        // const filterDate = moment('2025-07-01').startOf('day').toDate();
        const start = moment('2025-07-01').startOf('day').toDate();
        const end = moment('2025-07-31').endOf('day').toDate();

        const invoiceFilter: any = {
            createdAt: { $gte: start, $lte: end },
            companyId: companyId,
            InvoiceStatus: "Done",
            branchName: "Georgetown",
            BillType: { $ne: "KOT" },
            delete: false
        };

        // const invoices = await InvoiceModel.updateMany(invoiceFilter, {
        //     delete: true
        // })
        // const invoices = await InvoiceModel.find(invoiceFilter)
        const invoices = await InvoiceModel.find(invoiceFilter)
            .select("_id branchName createdAt grandTotal invoiceId delete")
            .lean();

        let totalGrandTotal = invoices.reduce((sum, inv) => {
            const val = inv.grandTotal == null ? 0 : Number(inv.grandTotal);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // await Promise.all(invoices).then((value) => {
        //     console.log(value.length);
        //     value.forEach((inv: any) => {

        //         InvoiceModel.findByIdAndUpdate({ _id: inv._id }, {
        //             branchName: "Berbice"
        //         }).then((data) => {
        //             console.log(data);

        //         }).catch((error) => {
        //             console.log(error);

        //         })
        //     })
        // })

        // console.log(invoices);cls

        console.log("PONG");


        return NextResponse.json({ message: "Pong", totalGrandTotal, invoices, length: invoices.length }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}



