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
    taxCode?: string;
}

export interface IInvoice extends Document {
    invoiceId: string;
    invoiceIdTrack: string;
    companyId: mongoose.Types.ObjectId;
    branchId: mongoose.Types.ObjectId;
    clientName: string;
    clientPhone?: string;
    companyName?: string;
    companyAddress?: string;
    branchName?: string;
    issueDate: Date;
    products: Product[];
    subTotal: number;
    appliedTaxes?: Tax[];
    totalTaxAmount: number;
    grandTotal: number;
    createdBy: mongoose.Types.ObjectId;
    BillType: string;
    paymentMode: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    currency: string;
    InvoiceStatus: string;
    discountValue: number;
    discountType: string;
    delete: boolean;
    important: boolean;
    isExempted?: boolean;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    Specification: { type: String },
});

const TaxSchema: Schema = new Schema({
    taxName: { type: String, },
    percentage: { type: Number, },
    amount: { type: Number, },

});

const InvoiceSchema: Schema = new Schema<IInvoice>(
    {
        companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Company" },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        invoiceId: { type: String, required: true },
        invoiceIdTrack: { type: String, required: true },
        clientName: { type: String, default: "" },
        clientPhone: { type: String, default: "" },
        companyName: { type: String, default: "" },
        companyAddress: { type: String, default: "" },
        branchName: { type: String, default: "" },
        issueDate: { type: Date, default: new Date() },
        products: { type: [ProductSchema], required: true },
        subTotal: { type: Number, required: true },
        appliedTaxes: { type: [TaxSchema], },
        totalTaxAmount: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        BillType: { type: String, default: "" },
        InvoiceStatus: { type: String, default: "", enum: ['Done', 'Hold', 'Cancel'] },
        paymentMode: { type: String, default: "CASH", },
        currency: { type: String, required: true },
        notes: { type: String },
        discountType: { type: String },
        discountValue: { type: Number, default: 0 },
        delete: { type: Boolean, default: false },
        important: { type: Boolean, default: false },
        isExempted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
