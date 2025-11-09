import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from "@/Model/Company.model";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import moment from "moment";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const user_id = await verifyUser();
        if (!user_id) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const User = await UserModel.findById(user_id);
        if (!User) return NextResponse.json({ message: "User not found", success: false }, { status: 404 });

        const companyId = User.companyId;
        const company = await CompanyModel.findById(companyId);
        if (!company) return NextResponse.json({ message: "Company not found", success: false }, { status: 404 });

        const last6Month = moment().subtract(6, 'months').startOf('day').toDate();
        const lastYear = moment().subtract(1, 'year').startOf('day').toDate();
        const filterDate = lastYear

        const { dateRange } = await request.json();

        // if (dateRange == "Last 6 Months") {
        //     filterDate = last6Month;
        // }
        // if (dateRange == "Last 1 Year") {
        //     filterDate = lastYear;
        // }


        const invoiceFilter: any = {
            createdAt: { $gte: filterDate },
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" }
        };

        if (User.role === "Owner") {
            invoiceFilter.companyId = companyId;
        } else {
            invoiceFilter.createdBy = user_id;
        }
        const total = await InvoiceModel.countDocuments(invoiceFilter);

        const invoices = await InvoiceModel.find(invoiceFilter).select("grandTotal issueDate branchId createdAt createdBy branchName")
            .sort({ createdAt: -1 })
            .lean();

        const data = (await filterInvoicesByBranch(invoices)).flat();

        return NextResponse.json(
            { data, total, success: true },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}

const filterInvoicesByBranch = async (invoices: any[]) => {

    const groupedData: Record<string, any[]> = invoices.reduce<Record<string, any[]>>((acc, item) => {
        if (!acc[item.branchName]) {
            acc[item.branchName] = [];
        }
        acc[item.branchName].push(item);
        return acc;
    }, {});

    const data = await Promise.all(
        Object.entries(groupedData).map(async ([branch, branchInvoices]) => {
            const newData = await filterInvoicesByMonth({ branch, branchInvoices });
            return newData;
        })
    );
    return data

}

const filterInvoicesByMonth = async ({
    branch,
    branchInvoices,
}: {
    branch: string;
    branchInvoices: { createdAt: string; grandTotal: number }[];
}) => {
    const groupedByMonth = branchInvoices.reduce<Record<string, any[]>>((acc, item) => {
        const date = new Date(item.createdAt);
        const monthKey = date.toLocaleString("en-US", { month: "long", year: "numeric" });

        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(item);

        return acc;
    }, {});

    const data = Object.entries(groupedByMonth).map(([month, records]) => {
        const totalGrand = records.reduce((sum, record) => sum + record.grandTotal, 0);

        return {
            branch,
            month,
            totalGrand,
            count: records.length,
        };
    });
    return data;
};
