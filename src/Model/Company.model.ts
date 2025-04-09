import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
    name: string;
    address: string;
    email?: string;
    phone?: string;
    gstNumber?: string;
    panNumber?: string;
    logoUrl?: string;
    website?: string;
    ownerId: mongoose.Types.ObjectId;
    staffIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema: Schema = new Schema<ICompany>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        gstNumber: { type: String }, // For Indian companies
        panNumber: { type: String }, // Optional for taxation
        logoUrl: { type: String },
        website: { type: String },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
        staffIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
