import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    companyId: mongoose.Types.ObjectId;
    name: string;
    phone: string;
    email?: string;
    password: string,
    profilePic?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        zipCode?: string;
    },
    isAdmin: boolean,
    role?: string;
    isActive: boolean;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        profilePic: { type: String },
        address: {
            country: { type: String },
            state: { type: String },
            city: { type: String },
            zipCode: { type: String }
        },
        isAdmin: { type: Boolean, default: false },
        role: { type: String, default: "Owner" },
        isActive: { type: Boolean, default: true },
        joinedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
