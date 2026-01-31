import { result } from "@/data/DATA";
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

        // const {TARGET, startDate, endDate,branchId} = await request.json();

        const companyId = "6803e4c62a9cdbcaf5b3e6e4"
        const branchId = "6803e4c62a9cdbcaf5b3e6e4"
        // const branchName = "Georgetown" //  1.6 per day
        const branchName = "Berbice" // 1.3 per day

        const start = moment('2025-11-01').startOf('day').toDate();
        const end = moment('2025-11-30').endOf('day').toDate(); // 23rd December

        // return NextResponse.json({ message: "Debug stop", }, { status: 200 });

        const invoiceFilter: any = {
            companyId,
            branchName,
            createdAt: { $gte: start, $lte: end },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" },
            // delete: false,
            important: { $ne: true }
        };
        const TARGET = 370000;
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

const a = 444555;

// export async function POST(request: Request) {
//     try {
//         const companyId = "6803e4c62a9cdbcaf5b3e6e4"
//         const branchId = "6803e4c62a9cdbcaf5b3e6e4"
//         // const branchName = "Georgetown" //  1.6 per day 693
//         const branchName = "Berbice" // 1.3 per day

//         const start = moment('2025-05-01').startOf('day').toDate();
//         const end = moment('2025-11-30').endOf('day').toDate();

//         const invoiceFilter: any = {
//             companyId,
//             branchName,
//             createdAt: { $gte: start, $lte: end },
//             InvoiceStatus: "Done",
//             BillType: { $ne: "KOT" },
//         };

//         const result = await InvoiceModel.updateMany(
//             invoiceFilter,
//             { $set: { delete: false } }
//         );

//         // const result = await InvoiceModel.find(invoiceFilter)

//         // const validInvoices: any[] = [];
//         // let expectedInvoiceId = 694;

//         // for (const invoice of result) {
//         //     const currentInvoiceId = Number(invoice.invoiceId);

//         //     if (currentInvoiceId === expectedInvoiceId) {
//         //         validInvoices.push(invoice);
//         //         expectedInvoiceId++;
//         //     }
//         // }

//         // const validInvoiceIds = validInvoices.map(inv => inv._id);
//         // await InvoiceModel.updateMany(
//         //     { ...invoiceFilter, _id: { $nin: validInvoiceIds } },
//         //     { $set: { delete: true } }
//         // );

//         // // Step 3: ensure valid invoices are active
//         // await InvoiceModel.updateMany(
//         //     { _id: { $in: validInvoiceIds } },
//         //     { $set: { delete: false } }
//         // );


//         // console.log("Updated invoices:", result.modifiedCount);

//         // console.log("Updated invoices count:", result.modifiedCount);
//         return NextResponse.json({ message: "done", result }, { status: 200 });

//     } catch (error) {
//         console.log(error);

//         return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
//     }
// }


const b = 44555;

// export async function POST(request: Request) {
//     try {
//         const listResult = result; // your invoice list (already ordered by date desc)

//         const validInvoices: any[] = [];
//         let expectedInvoiceId = 1;

//         // Traverse from bottom (oldest)
//         for (let i = listResult.length - 1; i >= 0; i--) {
//             const currentInvoiceId = Number(listResult[i].invoiceId);

//             if (currentInvoiceId === expectedInvoiceId) {
//                 validInvoices.unshift(listResult[i]); // maintain original order
//                 expectedInvoiceId++;
//             }
//         }

//         return NextResponse.json({ message: "done", validInvoices }, { status: 500 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
//     }

// }