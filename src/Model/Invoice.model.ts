import mongoose, { Schema, Document } from "mongoose";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
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
    taxPercentage: number;
    taxAmount: number;
    grandTotal: number;
    staffId?: mongoose.Types.ObjectId;
    paymentMode: "CASH" | "CARD" | "BANK_TRANSFER" | "UPI" | "OTHER";
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
        taxPercentage: { type: Number, default: 0 },
        taxAmount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
        paymentMode: {
            type: String,
            enum: ["CASH", "CARD", "BANK_TRANSFER", "UPI", "OTHER"],
            default: "CASH",
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
