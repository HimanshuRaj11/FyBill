import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IBranch, ICompany } from '../../../types/model';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { Badge } from '../ui/badge';
import { Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';


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
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Update Multiple Products</h2>
                        <Badge
                            variant={ChangeProducts.length > 0 ? "default" : "outline"}
                            className={`${ChangeProducts.length > 0
                                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                } transition-colors duration-200`}
                        >
                            {ChangeProducts.length} {ChangeProducts.length === 1 ? 'Change' : 'Changes'}
                        </Badge>
                    </div>
                    <Button
                        onClick={handleMultipleUpdate}
                        disabled={isLoading || products.length === 0 || ChangeProducts.length === 0}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Update All Products
                            </>
                        )}
                    </Button>
                </div>

                {/* Info Banner */}
                {ChangeProducts.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            You have {ChangeProducts.length} unsaved {ChangeProducts.length === 1 ? 'change' : 'changes'}. Click "Update All Products" to save.
                        </p>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Product Name</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((product) => {
                            const hasChanges = ChangeProducts.some(item => item._id === product._id);
                            return (
                                <tr
                                    key={product._id}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${hasChanges ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    {/* Product Name */}
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            value={product.name}
                                            onChange={(e) => handleFieldChange(product._id, 'name', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors[`${product._id}-name`]
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            placeholder="Enter product name"
                                        />
                                        {errors[`${product._id}-name`] && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors[`${product._id}-name`]}
                                            </p>
                                        )}
                                    </td>

                                    {/* Category */}
                                    <td className="p-4">
                                        <div className="relative">
                                            <select
                                                value={product.category}
                                                onChange={(e) => handleFieldChange(product._id, 'category', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none cursor-pointer transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors[`${product._id}-categoryId`]
                                                    ? 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                            >
                                                <option value="" className="dark:bg-gray-700">Select Category</option>
                                                {categories.map((category, i) => (
                                                    <option key={i} value={category} className="dark:bg-gray-700">
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors[`${product._id}-category`] && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors[`${product._id}-category`]}
                                            </p>
                                        )}
                                    </td>

                                    {/* Price */}
                                    <td className="p-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                                {Company?.currency?.symbol || '$'}
                                            </span>
                                            <input
                                                type="number"
                                                onWheel={(e) => e.currentTarget.blur()}
                                                value={product.price}
                                                onChange={(e) => handleFieldChange(product._id, 'price', parseFloat(e.target.value))}
                                                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors[`${product._id}-price`]
                                                    ? 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                required
                                                placeholder="0.00"
                                                min="0"
                                                step="1"
                                            />
                                        </div>
                                        {errors[`${product._id}-price`] && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors[`${product._id}-price`]}
                                            </p>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4">
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
                                            disabled={!hasChanges}
                                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reset
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
                <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-gray-400 dark:text-gray-500">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No products to display</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Add some products to get started</p>
                    </div>
                </div>
            )}

            {/* Summary Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> total product{products.length !== 1 ? 's' : ''}
                        {ChangeProducts.length > 0 && (
                            <span className="ml-2 text-blue-600 dark:text-blue-400">
                                • <span className="font-semibold">{ChangeProducts.length}</span> pending {ChangeProducts.length === 1 ? 'change' : 'changes'}
                            </span>
                        )}
                    </p>
                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">
                                {Object.keys(errors).length} validation {Object.keys(errors).length === 1 ? 'error' : 'errors'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultipleProductUpdate;