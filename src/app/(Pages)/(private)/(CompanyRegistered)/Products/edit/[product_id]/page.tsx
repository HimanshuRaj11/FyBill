'use client'
import PreLoader from '@/Components/Other/PreLoader';
import axios from 'axios';
import { AlertCircle, ArrowLeft, Save, Package, FileText, Tag, Building2, DollarSign, CheckCircle2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export default function Page({ params }: { params: Promise<{ product_id: string }> }) {
    const { Company } = useSelector((state: any) => state.Company);

    const branches = Company?.branch
    const { product_id } = React.use(params);
    const [product, setProduct] = useState({
        _id: product_id,
        name: '',
        description: '',
        price: 0,
        branchId: "",
        category: "",

    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        try {

            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/update`, { product });
            setSaveSuccess(true);
            setError(null);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err: any) {
            setError('Failed to update product. Please try again.');
            console.error('Error updating product:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    const fetchProduct = useCallback(async () => {

        try {
            const categoriesRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/fetch`);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetchProductById`, { product_id })
            const Product = data.product
            setCategories(categoriesRes?.data?.category?.category || []);

            setProduct(Product)
            setIsLoading(false)

        } catch (error) {

        }
    }, [product_id])
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct])


    if (isLoading) {
        return <PreLoader />
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header Section */}
                <div className="mb-6">
                    <button
                        onClick={goBack}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-4"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Update your product information</p>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg shadow-sm animate-in slide-in-from-top duration-300">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0" size={20} />
                            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 rounded-lg shadow-sm animate-in slide-in-from-top duration-300">
                        <div className="flex items-center">
                            <CheckCircle2 className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" size={20} />
                            <p className="text-green-700 dark:text-green-300 font-medium">Product updated successfully!</p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    Description
                                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none transition-all duration-200"
                                    placeholder="Enter product description"
                                ></textarea>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        value={product.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
                                    >
                                        <option value={''} className="dark:bg-gray-700">
                                            Select Category
                                        </option>

                                        {categories.map((category: any) => (
                                            <option key={category} selected={product?.category == category ? true : false} value={category} className="dark:bg-gray-700">
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
                            </div>

                            {/* Branch */}
                            <div className="space-y-2">
                                <label htmlFor="Branch" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    Branch
                                </label>
                                <div className="relative">
                                    <select
                                        id="Branch"
                                        name="branchId"
                                        value={product?.branchId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
                                    >
                                        <option value={''} className="dark:bg-gray-700">
                                            Select Branch
                                        </option>

                                        {branches.map((branch: any) => (
                                            <option key={branch._id} selected={product?.branchId == branch._id ? true : false} value={branch._id} className="dark:bg-gray-700">
                                                {branch.branchName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label htmlFor="rate" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    Rate ({Company?.currency.symbol})
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 dark:text-gray-400 font-medium">
                                        {Company?.currency.symbol}
                                    </span>
                                    <input
                                        type="number"
                                        id="rate"
                                        name="price"
                                        value={product.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${isSaving
                                            ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Helper text */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    All fields marked as required must be filled out
                </p>
            </div>
        </div>
    );
}