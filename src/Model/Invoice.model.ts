import mongoose, { Schema, Document } from "mongoose";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

interface Tax {
    taxName: string;
    percentage: number;
}

export interface IInvoice extends Document {
    invoiceId: string;
    companyId: mongoose.Types.ObjectId;
    clientName: string;
    clientPhone?: string;
    companyName?: string;
    companyAddress?: string;
    issueDate: Date;
    products: Product[];
    subTotal: number;
    taxes?: Tax[];
    grandTotal: number;
    createdBy: mongoose.Types.ObjectId;
    paymentMode: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const TaxSchema: Schema = new Schema({
    taxName: { type: String, required: true },
    percentage: { type: Number, required: true },
});

const InvoiceSchema: Schema = new Schema<IInvoice>(
    {
        invoiceId: { type: String, required: true, unique: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Company" },
        clientName: { type: String, required: true },
        clientPhone: { type: String },
        companyName: { type: String },
        companyAddress: { type: String },
        issueDate: { type: Date, required: true },
        products: { type: [ProductSchema], required: true },
        subTotal: { type: Number, required: true },
        taxes: { type: [TaxSchema], },
        grandTotal: { type: Number, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paymentMode: {
            type: String,
            default: "CASH",
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
