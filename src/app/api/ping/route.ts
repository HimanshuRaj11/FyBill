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
        // const lastYear = moment().subtract(1, 'year').startOf('day').toDate();
        // const filterDate = lastYear
        // const invoiceFilter: any = {
        //     createdAt: { $gte: filterDate },
        //     companyId: companyId,
        //     InvoiceStatus: "Done",
        //     branchName: "Barbies",
        //     BillType: { $ne: "KOT" }
        // };

        // const invoices = await InvoiceModel.find(invoiceFilter).select("grandTotal issueDate branchId createdAt createdBy branchName")
        //     .sort({ createdAt: -1 })
        //     .lean();

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



        return NextResponse.json({ message: "Pong", }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}



