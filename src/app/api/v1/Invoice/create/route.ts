import { verifyUser } from "@/lib/verifyUser";
import InvoiceModel from "@/Model/Invoice.model";
import UserModel from "@/Model/User.model";
import { generateInvoiceId } from "@/lib/generateInvoiceId";
import CompanyModel from "@/Model/Company.model";
export async function POST(request: Request) {

    try {
        const Unique_id = generateInvoiceId();

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
        const {
            clientName,
            phoneNumber,
            products,
            subTotal,
            appliedTaxes,
            totalTaxAmount,
            grandTotal,
            paymentMode
        } = await request.json();



        const invoice = await InvoiceModel.create({
            invoiceId: Unique_id,
            companyId: Company._id,
            clientName,
            clientPhone: phoneNumber,
            companyName: Company.name,
            companyAddress: Company.address.street + " " + Company.address.city + " " + Company.address.state + " " + Company.address.country + " " + Company.address.zipCode,
            issueDate: new Date(),
            products,
            subTotal,
            appliedTaxes,
            totalTaxAmount,
            grandTotal,
            paymentMode,
            currency: Company.currency.symbol,
            createdBy: User._id
        })

        return Response.json({ message: "Invoice created successfully", invoice }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: "Internal server error", error }, { status: 500 });
    }

}