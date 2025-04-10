import mongoose, { Schema, Document } from 'mongoose';

interface ITax extends Document {
    companyId: mongoose.Types.ObjectId;
    taxes: Array<{
        taxName: string;
        percentage: number;
    }>;
}

const taxSchema = new Schema<ITax>({
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    taxes: [{
        taxName: {
            type: String,
            required: true,
            trim: true
        },
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }]
}, {
    timestamps: true
});

const TaxModel = mongoose.models.Tax || mongoose.model<ITax>('Tax', taxSchema);

export default TaxModel;
