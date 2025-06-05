import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    product_number: Number
    price: number;
    description: string;
    category: string;
    companyId: mongoose.Types.ObjectId;
    branchId: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    product_number: { type: Number },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company ID is required']
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
