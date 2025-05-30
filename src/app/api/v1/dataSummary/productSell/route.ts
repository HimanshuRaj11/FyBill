import branchModel from '@/Model/branch.model';
import { IUser } from './../../../../../Model/User.model';
import { verifyUser } from "@/lib/verifyUser";
import CompanyModel from '@/Model/Company.model';
import InvoiceModel from '@/Model/Invoice.model';
import UserModel from "@/Model/User.model";
import { NextResponse } from 'next/server';
interface IProduct {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

export async function POST(request: Request) {
    try {
        const User_id = await verifyUser();
        if (!User_id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const User = await UserModel.findById({ _id: User_id })
        if (!User) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        const Company = await CompanyModel.findById({ _id: User.companyId })
        if (!Company) {
            return Response.json({ message: "Company not found" }, { status: 404 });
        }
        const { selectedBranch, startDate, endDate } = await request.json();

        const Invoices = await InvoiceModel.find({
            companyId: User.companyId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            },
            ...(selectedBranch !== "All" && { branchId: selectedBranch }),
            InvoiceStatus: "Done",
            BillType: { $ne: "KOT" }
        })

        const FinalList = GetProductDataSummary(Invoices)
        return NextResponse.json({ message: "", FinalList, success: true }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }

}


function GetProductDataSummary(Invoices: any[]) {

    const products = <IProduct[]>[];
    Invoices.map((invoice) => {
        const productList = invoice.products
        productList.forEach((product: IProduct) => {
            products.push(product)
        });

    })

    const newProjectList: IProduct[] = [];

    products.forEach((product: IProduct) => {
        const existingProduct = newProjectList.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
            existingProduct.amount += product.amount;
            if (existingProduct.name === "Complement") {
                existingProduct.rate = 0
            }
        } else {
            newProjectList.push(product);
        }
    });
    return newProjectList;
}