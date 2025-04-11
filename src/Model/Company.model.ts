import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    email?: string;
    phone: string;
    gstNumber?: string;
    panNumber?: string;
    logoUrl?: string;
    website?: string;
    description: string;
    ownerId: mongoose.Types.ObjectId;
    staffIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    industry: string;
    companySize: string;
    currency: string;
    currencySymbol: string;
}


const CompanySchema: Schema = new Schema<ICompany>(
    {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        gstNumber: { type: String },
        panNumber: { type: String },
        logoUrl: { type: String },
        website: { type: String },
        description: { type: String, required: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        staffIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        industry: { type: String, required: true },
        companySize: { type: String, required: true },
        currency: { type: String, required: true, default: "USD" },
        currencySymbol: { type: String, required: true, default: "$" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
