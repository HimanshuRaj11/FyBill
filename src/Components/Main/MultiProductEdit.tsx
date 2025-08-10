import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IBranch, ICompany } from '../../../types/model';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { Badge } from '../ui/badge';


interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    branchId: any;
}

interface BulkUpdateTableProps {
    initialProducts: Product[];
    Company: any;
    categories: string[];
    onUpdateSuccess?: (updatedProducts: Product[]) => void;
    onUpdateError?: (error: any) => void;
}

const MultipleProductUpdate: React.FC<BulkUpdateTableProps> = ({
    initialProducts,
    Company,
    categories,
}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [ChangeProducts, setChangeProducts] = useState<Product[]>([])

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);


    const handleFieldChange = (productId: string, field: keyof Product, value: string | number) => {
        setProducts(prev =>
            prev.map(product =>
                product._id === productId
                    ? { ...product, [field]: value }
                    : product
            )
        );
        const productUpdated = {
            _id: productId,
            [field]: value
        }
        setChangeProducts((prev: any) => {
            const existProducts = prev && prev.some((item: any) => item._id == productUpdated._id)
            if (existProducts) {
                return prev.map((item: any) => {
                    return item._id === productUpdated._id ? { ...item, ...productUpdated } : item;
                });
            } else {
                return [...prev, productUpdated];
            }


        });

        // Clear error for this field
        const errorKey = `${productId}-${field}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    // Validate all products
    const validateProducts = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        products.forEach(product => {
            if (!product.name.trim()) {
                newErrors[`${product._id}-name`] = 'Product name is required';
            }
            if (!product.category) {
                newErrors[`${product.name}-categoryId`] = 'Category is required';
            }
            if (product.price <= 0) {
                newErrors[`${product.name}-price`] = 'Price must be greater than 0';
            }
            if (Company.branch.length > 0 && !product.branchId) {
                newErrors[`${product.name}-branch`] = 'Branch is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle bulk update submission
    const handleMultipleUpdate = async () => {
        if (!validateProducts()) {
            return;
        }
        setIsLoading(true);
        try {

            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/updatemany`, { products: ChangeProducts });

            if (res.data.success) {
                toast.success(`${res.data.message}`)
            } else {
                throw new Error(res.data.message || 'Update failed');
            }
        } catch (error: any) {
            toast.error('update error:', error);
        } finally {
            setChangeProducts([]);
            setIsLoading(false);
        }
    };


    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">Update Multiple Products</h2>
                        <Badge variant={"outline"}>
                            {ChangeProducts.length}
                        </Badge>
                    </div>
                    <Button
                        onClick={handleMultipleUpdate}
                        disabled={isLoading || products.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Updating...' : 'Update All Products'}
                    </Button>
                </div>
            </div>

            <div className="overflow-x-scroll">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Product Name</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                            <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                {/* Product Name */}
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleFieldChange(product._id, 'name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`${product._id}-name`] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter product name"
                                    />
                                    {errors[`${product._id}-name`] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[`${product._id}-name`]}</p>
                                    )}
                                </td>



                                {/* Category */}
                                <td className="p-4">
                                    <select
                                        value={product.category}

                                        onChange={(e) => handleFieldChange(product._id, 'category', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`${product._id}-categoryId`] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category, i) => (
                                            <option key={i} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {errors[`${product._id}-category`] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[`${product._id}-category`]}</p>
                                    )}
                                </td>

                                {/* Price */}
                                <td className="p-4">
                                    <input
                                        type="number"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        value={product.price}
                                        onChange={(e) => handleFieldChange(product._id, 'price', parseFloat(e.target.value))}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`${product._id}-price`] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                        placeholder="0.00"
                                        min="0"
                                        step="1"
                                    />
                                    {errors[`${product._id}-price`] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[`${product._id}-price`]}</p>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => {
                                                // Reset individual product to original values
                                                const originalProduct = initialProducts.find(p => p._id === product._id);
                                                if (originalProduct) {
                                                    setProducts(prev =>
                                                        prev.map(p => p._id === product._id ? { ...originalProduct } : p)
                                                    );
                                                }
                                                setChangeProducts(prevItems => prevItems.filter(item => item._id !== product._id));
                                            }}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {products.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No products to display
                </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Total products: {products.length}
                    {Object.keys(errors).length > 0 && (
                        <span className="text-red-500 ml-2">
                            • {Object.keys(errors).length} validation errors
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default MultipleProductUpdate;