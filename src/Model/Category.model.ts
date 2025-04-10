import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
    category: string[];
    companyId: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
    category: [{
        type: String,
        required: true,
        trim: true
    }],
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    }
}, {
    timestamps: true
});

const ProductCategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default ProductCategoryModel;
