export interface IBranch extends Document {
    companyId: mongoose.Types.ObjectId;
    branchName: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    email?: string;
    phone: string;
    CountryCode: string;
    gstNumber?: string;
    panNumber?: string;
    lastInvoiceNo: number;
    ownerId: mongoose.Types.ObjectId;
    staffIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}


export interface ICompany extends Document {
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    email?: string;
    phone: string;
    countryCode: string;
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
    lastInvoiceNo: number;
    currency: {
        name: string;
        code: string;
        symbol: string;
    };
    branch: mongoose.Types.ObjectId[];
}
